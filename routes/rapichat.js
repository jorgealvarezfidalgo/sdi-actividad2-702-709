module.exports = function (app, swig, gestorBDUsuarios, gestorBDOfertas, gestorBDChats, logger) {

    app.post("/api/identificarse", function (req, res) {
        let seguro = app.get("crypto").createHmac('sha256', app.get('clave')).update(req.body.password).digest('hex');
        let criterio = {
            email: req.body.email,
            password: seguro
        };
        gestorBDUsuarios.obtenerUsuarios(criterio, function (usuarios) {
            if (usuarios == null || usuarios.length === 0) {
                // req.session.usuario = null;
                res.status(401);
                logger.info("Non-logged in user tries to log in with wrong credentials: " + criterio.email);
                res.json({
                    autenticado: false,
                    error: "Credenciales introducidas incorrectas"
                })
            } else {
                sesionemail = criterio.email;
                let ttoken = app.get('jwt').sign(
                    {usuario: criterio.email, id: usuarios[0]._id, tiempo: Date.now() / 1000},
                    "secreto");
                logger.info(criterio.email + " logs in.");
                // req.session.usuario = usuarios[0];
                res.status(200);
                res.json({
                    autenticado: true,
                    token: ttoken
                });
            }
        });
    });

    app.get("/api/oferta", function (req, res) {
        let criterio = {
            vendedor: {$ne: res.id}
        };
        gestorBDOfertas.obtenerOfertas(criterio, function (ofertas) {
            if (ofertas == null || ofertas.length === 0) {
                logger.error("Error listing other offers at API ");
                res.status(500);
                res.json({
                    error: "se ha producido un error"
                });
            } else {
                logger.info("API user lists other offers.");
                res.status(200);
                res.send(JSON.stringify(ofertas));

            }
        });
    });

    app.get("/api/chat", function (req, res) {
        let criterio = {
            $or: [{"creador._id": res.id}, {"vendedor._id": res.id}]
        };
        gestorBDChats.obtenerChats(criterio, function (chats) {
            if (chats == null) {
                logger.error("Error listing chats for API user");
                res.status(500);
                res.json({
                    error: "Se ha producido un error durante la carga"
                });
            } else {
                let contador = 0;
                for (let i = 0; i < chats.length; i++) {
                    let criterioNoLeidos = {
                        "chat": chats[i]._id,
                        "autor": {$ne: res.id},
                        leido: false
                    };
                    gestorBDChats.obtenerMensajes(criterioNoLeidos, function (mensajes) {
                        contador++;
                        chats[i].noLeidos = mensajes.length;
                        if (contador === chats.length) {
                            logger.info("API user lists his chats.");
                            res.status(200);
                            res.send(JSON.stringify(chats));
                        }
                    });
                }
            }
        })
    });

    app.get("/api/chat/:id", function (req, res) {
        let idChat = null;
        try {
            idChat = gestorBDChats.mongo.ObjectID(req.params.id);
        } catch (e) {
            res.status(500);
            res.json({
                error: "ID del chat inválido"
            });
            return;
        }
        let criterio = {
            "_id": idChat,
            $or: [{"creador._id": res.id}, {"vendedor._id": res.id}]
        };
        gestorBDChats.obtenerChats(criterio, function (chats) {
            if (chats == null) {
                logger.error("Error entering chat " + idChat + " for API user");
                res.status(500);
                res.json({
                    error: "Se ha producido un error durante la carga"
                });
            } else if (chats.length === 0) {
                logger.info("There is no chat " + idChat + " for API user to enter.");
                res.status(500);
                res.json({
                    error: "Acceso no permitido al chat"
                });
            } else {
                logger.info("Chat " + idChat + " entered by API user");
                res.status(200);
                res.send(JSON.stringify(chats));
            }
        })
    });

    app.get("/api/mensaje/chat/:chat", function (req, res) {
        //Carga mensajes dado un chat (para el listado de chats)
        let idChat = null;
        try {
            idChat = gestorBDChats.mongo.ObjectID(req.params.chat);
        } catch (e) {
            res.status(500);
            res.json({error: "ID introducido inválido"});
            return;
        }
        let criterio = {
            "_id": idChat,
            $or: [{"creador._id": res.id}, {"vendedor._id": res.id}]
        };
        gestorBDChats.obtenerChats(criterio, function (chats) {
            if (chats == null || chats.length === 0) {
                logger.error("Error loading chat " + idChat + " for API user");
                res.status(500);
                res.json({error: "No se puede cargar el chat"});
            } else {
                gestorBDChats.obtenerMensajes({"chat": chats[0]._id}, function (mensajes) {
                    if (mensajes == null) {
                        logger.error("Cannot load messages for chat " + idChat + " for API user");
                        res.status(500);
                        res.json({error: "No se pueden cargar los mensajes"});
                    } else {
                        logger.info("Loading messages for chat " + idChat + " for API user");
                        res.status(200);
                        res.send(JSON.stringify(mensajes));
                    }
                });
            }
        });
    });

    app.get("/api/mensaje/oferta/:oferta", function (req, res) {
        //Carga mensajes dada una oferta (para acceder desde el listado de ofertas)
        // Se comprueba que se pasa una oferta válida
        let idOferta = null;
        try {
            idOferta = gestorBDOfertas.mongo.ObjectID(req.params.oferta);
        } catch (e) {
            logger.error("Error loading offer for API user");
            res.status(500);
            res.json({error: "Oferta introducida inválida"});
            return;
        }
        let criterioOferta = {"_id": idOferta};
        gestorBDOfertas.obtenerOfertas(criterioOferta, function (ofertas) {
            if (ofertas == null || ofertas.length === 0) {
                logger.error("Error loading offer " + idOferta + " for API user");
                res.status(500);
                res.json({
                    error: "No existe la oferta"
                });
                return;
            }
            let criterioChat = {
                "oferta._id": idOferta,
                $or: [{"creador._id": res.id}, {"vendedor._id": res.id}]
            };
            gestorBDChats.obtenerChats(criterioChat, function (chats) {
                if (chats == null) {
                    // No hay chats de esa oferta
                    logger.error("Error loading chat for offer" + idOferta + " for API user");
                    res.status(500);
                    res.json({
                        error: "Se ha producido un error durante la carga"
                    });
                } else if (chats.length === 0) {
                    logger.info("No chat for offer" + idOferta + " for API user");
                    res.status(200);
                    res.send({});
                } else if (chats.length > 1 || chats[0].vendedor._id.equals(res.id)) {
                    logger.info("Loading chats for offer" + idOferta + " for API user");
                    // El usuario es el vendedor
                    res.status(200);
                    res.send(JSON.stringify(chats));
                } else {
                    logger.info("Loading chat for offer" + idOferta + " for API user");
                    let criterioMensajes = {chat: chats[0]._id};
                    gestorBDChats.obtenerMensajes(criterioMensajes, function (mensajes) {
                        res.status(200);
                        res.send(JSON.stringify(mensajes));
                    })
                }
            })
        });
    });

    app.post("/api/chat/mensaje", function (req, res) {
        // Se comprueba que se pasa una oferta
        if (req.body.chat == null) {
            logger.error("Error sending message for API user" + "; no chat provided.");
            res.status(500);
            res.json({error: "Se requiere una oferta"});
            return;
        }
        let criterioChat = {
            "_id": gestorBDChats.mongo.ObjectId(req.body.chat),
            $or: [{"creador._id": res.id}, {"vendedor._id": res.id}]
        };
        gestorBDChats.obtenerChats(criterioChat, function (chats) {
            if (chats == null || chats.length !== 1) {
                logger.error("Error sending message for chat" + req.body.chat + " for API user");
                res.status(500);
                res.json({
                    error: "No existe el chat"
                });
                return;
            }
            let nuevoMensaje = {
                autor: res.id,
                hora: new Date(),
                text: req.body.texto,
                leido: false,
                chat: chats[0]._id
            };
            gestorBDChats.insertarMensaje(nuevoMensaje, function (mensajeInsertado) {
                logger.info("API user sends a message to chat " + req.body.chat);
                res.status(200);
                res.json(mensajeInsertado);
            });
        });
    });

    app.post("/api/mensaje", function (req, res) {
        // Se comprueba que se pasa una oferta
        if (req.body.oferta == null) {
            logger.error("Error sending message for API user" + "; no offer provided.");
            res.status(500);
            res.json({
                error: "Se requiere una oferta"
            });
            return;
        }
        let idOferta = gestorBDOfertas.mongo.ObjectID(req.body.oferta);
        // Se verifica que la oferta existe
        let criterioOferta = {"_id": idOferta};
        gestorBDOfertas.obtenerOfertas(criterioOferta, function (ofertas) {
            if (ofertas == null || ofertas.length === 0) {
                logger.error("Error sending message for offer" + idOferta + " for API user");
                res.status(500);
                res.json({
                    error: "No existe la oferta"
                });
                return;
            }
            let criterioChat = {
                "oferta._id": idOferta,
                $or: [{"creador._id": res.id}, {"vendedor._id": res.id}]
            };
            // En caso de que el chat lo envíe el vendedor, debe especificar el chat (puede haber varios para la
            // misma oferta)
            if (ofertas[0].vendedor.equals(res.id)) {
                if (req.body.chat == null) {
                    logger.error("Error sending message for offer" + idOferta + " for API user" + "; no chat.");
                    res.status(500);
                    res.json({
                        error: "El autor de la oferta debe especificar oferta y chat concreto al que enviar el mensaje"
                    });
                    return;
                } else {
                    criterioChat._id = gestorBDChats.mongo.ObjectID(req.body.chat)
                }
            }

            gestorBDChats.obtenerChats(criterioChat, function (chats) {
                let nuevoMensaje = {
                    autor: res.id,
                    hora: new Date(),
                    text: req.body.texto,
                    leido: false
                };
                if (chats.length === 0) {
                    if (ofertas[0].vendedor.equals(res.id)) {
                        logger.error("Offer creator API user" + " cannot start a chat for his offer");
                        res.status(500);
                        res.json({
                            error: "El autor de la oferta no puede comenzar un chat, se requiere un chat ya existente"
                        });
                    } else {
                        gestorBDUsuarios.obtenerUsuarios({"_id": ofertas[0].vendedor}, function (vendedor) {
                            gestorBDUsuarios.obtenerUsuarios({"_id": res.id}, function (creador) {
                                let nuevoChat = {
                                    creador: creador[0],
                                    vendedor: vendedor[0],
                                    oferta: ofertas[0]
                                };
                                gestorBDChats.insertarChat(nuevoChat, function (chatInsertadoID) {
                                    logger.info("Chat created for offer" + nuevoChat.oferta + " by API user");
                                    nuevoMensaje.chat = chatInsertadoID;
                                    gestorBDChats.insertarMensaje(nuevoMensaje, function (mensajeInsertado) {
                                        logger.info("API user sends a message to offer " + nuevoChat.oferta);
                                        res.status(200);
                                        res.json(mensajeInsertado);
                                    });
                                });
                            });

                        });
                    }
                } else {
                    nuevoMensaje.chat = chats[0]._id;
                    gestorBDChats.insertarMensaje(nuevoMensaje, function (mensajeInsertado) {
                        logger.info("API user sends a message to offer " + criterioChat.oferta);
                        res.status(200);
                        res.json(mensajeInsertado);
                    });
                }
            });
        });
    });

    app.put("/api/mensajeleido/:id", function (req, res) {
        // Se comprueba que se pasa un mensaje válido
        let idMensaje = null;
        try {
            idMensaje = gestorBDChats.mongo.ObjectID(req.params.id);
        } catch (e) {
            logger.error("Invalid message id to read: " + idMensaje);
            res.status(500);
            res.json({
                error: "ID del mensaje introducido inválido"
            });
            return;
        }
        gestorBDChats.obtenerMensajes({"_id": idMensaje}, function (mensajes) {
            if (mensajes == null || mensajes.length === 0) {
                logger.error("Message does not exist: " + idMensaje);
                res.status(500);
                res.json({error: "No existe el mensaje"});
                return;
            }
            if (mensajes[0].autor.equals(res.id)) {
                logger.error("Sender cannot mark as read his own message: " + idMensaje);
                res.status(500);
                res.json({error: "El mensaje no puede ser marcado como leído por el emisor"});
                return;
            }
            gestorBDChats.obtenerChats({"_id": mensajes[0].chat}, function (chats) {
                if (chats == null || chats.length === 0) {
                    logger.error("Cannot find chat for message to be read: " + idMensaje);
                    res.status(500);
                    res.json({error: "El mensaje existe pero falta el chat asociado"});
                } else if (!chats[0].creador._id.equals(res.id) && !chats[0].vendedor._id.equals(res.id)) {
                    logger.error("Cannot access message to read: " + idMensaje);
                    res.status(500);
                    res.json({error: "Acceso no permitido a este mensaje"});
                // } else if (mensajes[0].leido === true) {
                //     logger.error("Message already read: " + idMensaje);
                //     res.status(500);
                //     res.json({error: "El mensaje ya está marcado como leído"});
                } else {
                    mensajes[0].leido = true;
                    gestorBDChats.modificarMensaje({"_id": mensajes[0]._id}, mensajes[0], function (result) {
                        if (result == null) {
                            logger.error("Unknown error marking message as read: " + idMensaje);
                            res.status(500);
                            res.json({error: "se ha producido un error"})
                        } else {
                            logger.error("Message read: " + idMensaje);
                            res.status(200);
                            res.json({
                                mensaje: "Mensaje marcado como leído",
                                _id: req.params.id
                            })
                        }
                    });
                }
            });
        });
    });

    app.delete("/api/chat/:id", function (req, res) {
        try {
            gestorBDChats.mongo.ObjectID(req.params.id);
        } catch (e) {
            logger.error("Invalid chat id: " + req.params.id);
            res.status(500);
            res.json({
                error: "ID del chat introducido inválido"
            });
            return;
        }
        gestorBDChats.obtenerChats({"_id": gestorBDChats.mongo.ObjectID(req.params.id)}, function (chats) {
            if (chats == null || chats.length === 0) {
                logger.error("No chat found with id " + req.params.id);
                res.status(500);
                res.json({
                    error: "No existe chat con el ID introducido"
                });
            } else if (!chats[0].creador._id.equals(res.id) && !chats[0].vendedor._id.equals(res.id)) {
                logger.error("Cannot access chat with id " + req.params.id);
                res.status(500);
                res.json({
                    error: "Acceso no permitido a este chat"
                });
            } else {
                gestorBDChats.eliminarMensaje({chat: gestorBDChats.mongo.ObjectID(req.params.id)}, function (mensajes) {
                    gestorBDChats.eliminarChat({"_id": gestorBDChats.mongo.ObjectID(req.params.id)}, function (chats) {
                        if (chats == null) {
                            logger.error("Unknown error deleting chat " + req.params.id);
                            res.status(500);
                            res.json({
                                error: "se ha producido un error al borrar el chat"
                            })
                        } else {
                            logger.info("Deleting chat " + req.params.id);
                            res.status(200);
                            res.json({
                                Mensaje: "Mensajes borrados: " + mensajes.result.n
                            });
                        }
                    });
                });
            }
        });
    });

};