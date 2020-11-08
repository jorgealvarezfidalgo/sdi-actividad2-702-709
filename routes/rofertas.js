module.exports = function (app, swig, gestorBDOfertas, gestorBDUsuarios, logger) {

    function getCurrentDate() {
        let today = new Date();
        let dd = String(today.getDate()).padStart(2, '0');
        let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        let yyyy = today.getFullYear();
        return yyyy + "-" + mm + "-" + dd;
    }

    app.get('/offer/add', function (req, res) {
        logger.info(req.session.usuario.email + " access add offer page");
        let respuesta = swig.renderFile('views/baddoffer.html', {
            usuario: req.session.usuario,
            currentDate: getCurrentDate()
        });
        res.send(respuesta);
    });

    app.post("/offer/add", function (req, res) {
        logger.info(req.session.usuario.email + " requests to add an offer.");
        if (req.body.title < 2 || req.body.title > 50) {
            logger.info(req.session.usuario.email + " inputs wrong offer title.");
            res.redirect("/offer/add" +
                "?mensaje=Longitud del título inválida." +
                "&tipoMensaje=alert-danger ");
            return;
        }

        if (req.body.cost < 0) {
            logger.info(req.session.usuario.email + " inputs negative cost.");
            res.redirect("/offer/add" +
                "?mensaje=El precio no puede ser negativo." +
                "&tipoMensaje=alert-danger ");
            return;
        }

        if (req.body.description.length < 2 || req.body.description.length > 50) {
            logger.info(req.session.usuario.email + " inputs wrong offer description.");
            res.redirect("/offer/add" +
                "?mensaje=Longitud de la descripción inválida." +
                "&tipoMensaje=alert-danger ");
            return;
        }

        if (req.session.usuario.saldo < 20 && req.body.destacada !== undefined) {
            logger.info(req.session.usuario.email + " has not enough saldo to highlight an offer.");
            res.redirect("/offer/add" +
                "?mensaje=Saldo insuficiente." +
                "&tipoMensaje=alert-danger ");
            return;
        }

        let oferta = {
            title: req.body.title,
            description: req.body.description,
            cost: req.body.cost,
            date: getCurrentDate(),
            destacada: req.body.destacada !== undefined,
            vendedor: gestorBDOfertas.mongo.ObjectID(req.session.usuario._id),
            email: req.session.usuario.email
        };
        gestorBDOfertas.insertarOferta(oferta, function (id) {
            if (id == null) {
                logger.error("Error creating offer for " + req.session.usuario.email);
                res.send("Error al insertar canción");
            } else {
                if (oferta.destacada) {
                    logger.info(req.session.usuario.email + " creates highlighted offer." + id);
                    res.redirect("/user/saldo");
                } else {
                    logger.info(req.session.usuario.email + " creates unhighlighted offer." + id);
                    res.redirect("/offer/listown");
                }

            }
        });
    });

    app.get('/offer/delete/:id', function (req, res) {
        let criterio = {"_id": gestorBDOfertas.mongo.ObjectID(req.params.id)};
        gestorBDOfertas.eliminarOferta(criterio, function (canciones) {
            if (canciones == null) {
                logger.error("Error deleting offer " + req.params.id);
                res.send("Error al eliminar oferta.");
            } else {
                logger.info(req.session.usuario.email + " deletes offer" + req.params.id);
                res.redirect("/offer/listown");
            }
        });
    });

    app.get('/offer/highlight/:id', function (req, res) {
        let criterio = {"_id": gestorBDOfertas.mongo.ObjectID(req.params.id)};
        let oferta = {destacada: true};
        gestorBDOfertas.modificarOferta(criterio, oferta, function (result) {
            if (result == null) {
                logger.error("Error highlighting offer " + req.params.id);
                res.send("Error al destacar.");
            } else {
                logger.info(req.session.usuario.email + " highlights offer" + req.params.id);
                res.redirect("/offer/listown");
            }
        });
    });

    app.get('/offer/unhighlight/:id', function (req, res) {
        let criterio = {"_id": gestorBDOfertas.mongo.ObjectID(req.params.id)};
        let oferta = {destacada: false};
        gestorBDOfertas.modificarOferta(criterio, oferta, function (result) {
            if (result == null) {
                logger.error("Error unhighlighting offer " + req.params.id);
                res.send("Error al normalizar.");
            } else {
                logger.info(req.session.usuario.email + " unhighlights offer" + req.params.id);
                res.redirect("/offer/listown");
            }
        });
    });

    app.get('/offer/buy/:id', function (req, res) {
        let criterio = {
            "_id": gestorBDOfertas.mongo.ObjectID(req.params.id),
            "comprador": null
        };
        gestorBDOfertas.obtenerOfertas(criterio, function (ofertas) {
            if (ofertas == null || ofertas.length === 0)
                res.send("Error al comprar la oferta");
            else if (ofertas[0].cost > req.session.usuario.saldo)
                res.send("Error al comprar, saldo insuficiente");
            else {
                let oferta = {comprador: gestorBDOfertas.mongo.ObjectID(req.session.usuario._id)};
                gestorBDOfertas.modificarOferta(criterio, oferta, function (result) {
                    if (result == null) {
                        logger.error("Error buying offer " + req.params.id);
                        res.send("Error al normalizar.");
                    } else {
                        criterio = {"_id": gestorBDUsuarios.mongo.ObjectID(req.session.usuario._id)};
                        let nuevoSaldo = req.session.usuario.saldo - ofertas[0].cost;
                        let usuario = {"saldo": nuevoSaldo};
                        gestorBDUsuarios.modificarUsuario(criterio, usuario, function (result) {
                            if (result == null) {
                                logger.error("Error buying offer " + req.params.id);
                                res.send("Error al normalizar.");
                            } else {
                                req.session.usuario.saldo = nuevoSaldo;
                                logger.info(req.session.usuario.email + " buys offer" + req.params.id);
                                res.redirect("/offer/listothers");
                            }
                        });
                    }
                });
            }
        });
    });

    app.get('/offer/listown', function (req, res) {
        let criterio = {"vendedor": gestorBDOfertas.mongo.ObjectID(req.session.usuario._id)};
        gestorBDOfertas.obtenerOfertas(criterio, function (ofertas) {
            if (ofertas == null) {
                logger.error("Error listing own offers for " + req.session.usuario.email);
                res.send("Error listando ofertas.");
            } else {
                logger.info(req.session.usuario.email + " lists his own offers.");
                let respuesta = swig.renderFile('views/blistownoff.html', {
                    usuario: req.session.usuario,
                    offers: ofertas
                });
                res.send(respuesta);
            }
        });
    });

    app.get('/offer/listothers', function (req, res) {
        let criterio = {"vendedor": {$ne: gestorBDOfertas.mongo.ObjectID(req.session.usuario._id)}};
        let terminoBusqueda = req.query.busqueda;
        if (terminoBusqueda != null && terminoBusqueda !== "")
            criterio.title = {$regex: ".*" + req.query.busqueda + ".*", $options: 'i'};

        let pg = parseInt(req.query.pg); // Es String !!!
        if (req.query.pg == null) { // Puede no venir el param
            pg = 1;
        }
        gestorBDOfertas.obtenerOfertasPg(criterio, pg, function (ofertas, total) {
            if (ofertas == null) {
                logger.error("Error listing other offers for " + req.session.usuario.email);
                res.send("Error al listar ");
            } else {
                let ultimaPg = total / 5;
                if (total % 5 > 0) { // Sobran decimales
                    ultimaPg = ultimaPg + 1;
                }
                let paginas = []; // paginas mostrar
                for (let i = pg - 2; i <= pg + 2; i++) {
                    if (i > 0 && i <= ultimaPg) {
                        paginas.push(i);
                    }
                }
                let data = {
                    usuario: req.session.usuario,
                    offers: ofertas,
                    paginas: paginas,
                    actual: pg,
                    busqueda: terminoBusqueda
                };
                let respuesta = swig.renderFile('views/blistothers.html', data);
                logger.info(req.session.usuario.email + " lists " + data.paginas + " pages of offers.");
                res.send(respuesta);
            }
        });
    });

    app.get('/offer/listpurchases', function (req, res) {
        let criterio = {"comprador": gestorBDOfertas.mongo.ObjectID(req.session.usuario._id)};
        gestorBDOfertas.obtenerOfertas(criterio, function (ofertas) {
            if (ofertas == null) {
                logger.error("Error listing purchases for " + req.session.usuario.email);
                res.send("Error listando ofertas.");
            } else {
                logger.info(req.session.usuario.email + " lists his purchases.");
                let respuesta = swig.renderFile('views/blistpurchases.html', {
                    usuario: req.session.usuario,
                    offers: ofertas
                });
                res.send(respuesta);
            }
        });
    });

    app.get("/home", function (req, res) {
        let criterio = {"destacada": true};
        gestorBDOfertas.obtenerOfertas(criterio, function (ofertas) {
            if (ofertas == null) {
                logger.error("Error listing highlighted offers for " + req.session.usuario.email);
                res.send("Error listando ofertas destacadas.");
            } else {
                logger.info(req.session.usuario.email + " access his home page.");
                let respuesta = swig.renderFile('views/bhome.html', {
                    usuario: req.session.usuario,
                    offers: ofertas
                });
                res.send(respuesta);
            }

        });
    });

};