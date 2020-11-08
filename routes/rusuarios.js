module.exports = function (app, swig, gestorBD, gestorBDOfertas, logger) {

    app.get("/registrarse", function (req, res) {
        let respuesta = swig.renderFile('views/bregistro.html', {usuario: null});
        logger.info("User requests register page.");
        res.send(respuesta);
    });

    app.post('/usuario', function (req, res) {
        let seguro = app.get("crypto").createHmac('sha256', app.get('clave')).update(req.body.password).digest('hex');
        if(req.body.email==="" || req.body.name==="" ||req.body.lastName==="" ||req.body.password==="") {
            res.redirect("/registrarse?mensaje=No puede haber campos vacíos&tipoMensaje=alert-danger");
            return;
        }
        let usuario = {
            email: req.body.email,
            name: req.body.name,
            lastName: req.body.lastName,
            saldo: 100.0,
            password: seguro,
            rol: "ESTANDAR"
        };
        if (req.body.password !== req.body.passwordConfirm) {
            logger.info("User enters non-coinciding passwords.");
            res.redirect("/registrarse?mensaje=Las contraseñas no coinciden&tipoMensaje=alert-danger");
            return;
        }
        gestorBD.obtenerUsuarios({email: usuario.email}, function (usuarios) {
            if (usuarios == null || usuarios.length === 0) {
                gestorBD.insertarUsuario(usuario, function (id) {
                    if (id == null) {
                        logger.error("Error registering user.");
                        res.redirect("/registrarse?mensaje=Error al registrar usuario")
                    } else {
                        logger.info("User " + usuario.email + " is registered and accesses home page.");
                        req.session.usuario = usuario;
                        res.redirect("/home");
                    }
                });
            } else {
                logger.warn("User tries to register with an already existing email: " + usuario.email);
                res.redirect("/registrarse?mensaje=Ya existe ese usuario")
            }
        });

    });

    app.get("/", function (req, res) {
        logger.info("Access to root page.");
        let respuesta = swig.renderFile('views/broot.html', {usuario: null});
        res.send(respuesta);
    });

    app.get("/identificarse", function (req, res) {
        logger.info("Non-logged in user accesses log in.");
        let respuesta = swig.renderFile('views/bidentificacion.html', {usuario: null});
        res.send(respuesta);
    });

    app.post("/identificarse", function (req, res) {
        let seguro = app.get("crypto").createHmac('sha256', app.get('clave')).update(req.body.password).digest('hex');
        let criterio = {email: req.body.email, password: seguro};
        gestorBD.obtenerUsuarios(criterio, function (usuarios) {
            if (usuarios == null || usuarios.length === 0) {
                logger.info("Non-logged in user tries to log in with wrong credentials: " + criterio.email);
                req.session.usuario = null;
                res.redirect("/identificarse" +
                    "?mensaje=Email o password incorrecto"+
                    "&tipoMensaje=alert-danger ");
            } else {
                logger.info(criterio.email +  " logs in.");
                req.session.usuario = usuarios[0];
                res.redirect("/home");
            }
        });
    });

    app.get('/desconectarse', function (req, res) {
        logger.info(req.session.usuario.email +  " logs out.");
        req.session.destroy();
        res.redirect("/identificarse");
    });

    app.get("/user/list", function (req, res) {
        gestorBD.obtenerUsuarios({}, function (usuarios) {
            if (usuarios == null) {
                logger.error("Error listing users.");
                res.send("Error listando usuarios.");
            } else {
                logger.info("Admin lists users.");
                let respuesta = swig.renderFile('views/buserlist.html', {usuario: req.session.usuario, usuarios: usuarios});
                res.send(respuesta);
            }

        });
    });

    app.get('/user/delete/:id', function (req, res) {
        let criterioa = {"vendedor": req.params.id};
        logger.info("Removing " + req.params.id + " offers.");
        gestorBDOfertas.eliminarOferta(criterioa, function (ofertas) {
            if (ofertas == null) {
                logger.error("Error removing offers.");
                res.send("Se ha producido un error durante la eliminación.");
            }
        });
        logger.info("Removing user " + req.params.id);
        let criteriob = {"_id": gestorBD.mongo.ObjectID(req.params.id)};
        gestorBD.eliminarUsuario(criteriob, function (usuarios) {
            if (usuarios == null) {
                logger.error("Error removing user.");
                res.send(res);
            } else {
                logger.info(req.params.id + " successfully removed.");
                res.redirect("/user/list");
            }
        });
    });

    app.get("/user/saldo", function (req, res) {
        let criterio = {_id: gestorBD.mongo.ObjectID(req.session.usuario._id)};
        if(req.session.usuario.saldo<20.0) {
            logger.info(req.session.usuario.email + " has no saldo to highlight.");
            res.send("Saldo insuficiente.")
        } else {
            logger.info(req.session.usuario.email + " is substracted 20 dollars.");
            req.session.usuario.saldo = req.session.usuario.saldo - 20.0;
        }
        let email = req.session.usuario.email;
        gestorBD.obtenerUsuarios(criterio, function (usuarios) {
            if (usuarios == null) {
                res.send("No existe tal usuario");
                logger.error("Error finding user " + email);
            } else {

                let usuario = {saldo: usuarios[0].saldo-20.0};
                gestorBD.modificarUsuario(criterio, usuario, function (result) {
                    if (result == null) {
                        logger.error("Error modifying user " +email);
                        res.send("Error al modificar.");
                    } else {
                        console.log(req.session.usuario);
                        logger.info(email + " succesfully modified saldo.");
                        res.redirect("/offer/listown");
                    }
                });
            }
        });

    });
};