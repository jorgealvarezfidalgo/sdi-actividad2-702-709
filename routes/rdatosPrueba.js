module.exports = function (app, swig, gestorBDUsuarios, gestorBDOfertas, gestorBDChats, logger) {

    const PASSWORD = "123456";
    const PASSWORD_CIFRADA = app.get("crypto").createHmac('sha256', app.get('clave')).update(PASSWORD).digest('hex');
    const SALDO_BASE = 100.0;
    const ROL_ESTANDAR = "ESTANDAR";
    let currentDate = "2019-04-19";
    let inicioReseteo;
    let borradoCompleto = true;

    let usuario1, usuario2, usuario3, usuario4, usuario5;
    let usuarios;

    let oferta11, oferta12, oferta13, oferta21, oferta22, oferta23, oferta31, oferta32, oferta33, oferta41, oferta42;
    let oferta43, oferta51, oferta52, oferta53;
    let ofertas;

    let chat112, chat122, chat132, chat211, chat221, chat231, chat311, chat321, chat331, chat411, chat421, chat431;
    let chat511, chat521, chat531;
    let chats;

    let mensaje112a, mensaje112b, mensaje112c, mensaje112d, mensaje122a, mensaje122b, mensaje122c, mensaje122d;
    let mensaje132a, mensaje132b, mensaje132c, mensaje132d, mensaje211a, mensaje211b, mensaje211c, mensaje211d;
    let mensaje221a, mensaje221b, mensaje221c, mensaje221d, mensaje231a, mensaje231b, mensaje231c, mensaje231d;
    let mensaje311a, mensaje311b, mensaje311c, mensaje311d, mensaje321a, mensaje321b, mensaje321c, mensaje321d;
    let mensaje331a, mensaje331b, mensaje331c, mensaje331d, mensaje411a, mensaje411b, mensaje411c, mensaje411d;
    let mensaje421a, mensaje421b, mensaje421c, mensaje421d, mensaje431a, mensaje431b, mensaje431c, mensaje431d;
    let mensaje511a, mensaje511b, mensaje511c, mensaje511d, mensaje521a, mensaje521b, mensaje521c, mensaje521d;
    let mensaje531a, mensaje531b, mensaje531c, mensaje531d;
    let mensajes;

    app.get("/resetdb", function (req, res) {
        borradoCompleto = true;
        resetear(res);
    });

    app.get("/resetdbrapido", function (req, res) {
        borradoCompleto = false;
        resetear(res);
    });

    function resetear(res) {
        inicioReseteo = new Date();
        console.log("---------------------------");
        console.log("---------------------------");
        console.log("Reseteo de la base de datos");
        console.log("---------------------------");
        console.log("Borrado de datos:");
        borrarMensajes(res);
        logger.info("Reseteando el contenido de la base de datos.");
    }

    function borrarMensajes(res) {
            gestorBDChats.eliminarMensaje({}, function (mensajes) {
                console.log("Se han borrado " + mensajes.result.n + " mensajes");
                borrarChats(res);
            });


    }

    function borrarChats(res) {
            gestorBDChats.eliminarChat({}, function (chats) {
                console.log("Se han borrado " + chats.result.n + " chats");
                borrarOfertas(res);
            });
    }

    function borrarOfertas(res) {
        gestorBDOfertas.eliminarOferta({}, function (ofertas) {
            console.log("Se han borrado " + ofertas.result.n + " ofertas");
            borrarUsuarios(res);
        });
    }

    function borrarUsuarios(res) {
        gestorBDUsuarios.eliminarUsuario({'rol': "ESTANDAR"}, function (usuarios) {
            console.log("Se han borrado " + usuarios.result.n + " usuarios");
            InsertarUsuarios(res);
        });
    }

    function InsertarUsuarios(res) {
        console.log("---------------------------");
        console.log("Insertado de datos:");
        inicializarUsuarios();
        let contadorInsertados = 0;
        for (let i = 0; i < usuarios.length; i++) {
            usuarios[i].password = PASSWORD_CIFRADA;
            if (!usuarios[i].saldo) {
                usuarios[i].saldo = SALDO_BASE;
            }
            usuarios[i].rol = ROL_ESTANDAR;
            gestorBDUsuarios.insertarUsuario(usuarios[i], function (id, usuario) {
                usuario._id = id;
                contadorInsertados++;
                if (contadorInsertados === usuarios.length) {
                    console.log("Se han añadido " + contadorInsertados + " usuarios");
                    insertarOfertas(res);
                }
            });
        }
    }

    function insertarOfertas(res) {
        inicializarOfertas();
        let contadorInsertados = 0;
        for (let i = 0; i < ofertas.length; i++) {
            gestorBDOfertas.insertarOferta(ofertas[i], function (id, oferta) {
                contadorInsertados++;
                if (contadorInsertados === ofertas.length) {
                    if (borradoCompleto) {
                        oferta._id = id;
                        console.log("Se han añadido " + contadorInsertados + " ofertas");
                        insertarChats(res);
                    } else {
                        console.log("Se han añadido " + contadorInsertados + " ofertas");
                        let finReseteo = new Date();
                        console.log("---------------------------");
                        console.log("Tiempo empleado: " + ((finReseteo - inicioReseteo) / 1000) + " segundos");
                        res.send("Reseteo de la base de datos completado con éxito");
                    }
                }
            });
        }
    }

    function insertarChats(res) {
        inicializarChats();
        let contadorInsertados = 0;
        for (let i = 0; i < chats.length; i++) {
            gestorBDChats.insertarChat(chats[i], function (id, chat) {
                chat._id = id;
                contadorInsertados++;
                if (contadorInsertados === chats.length) {
                    console.log("Se han añadido " + contadorInsertados + " chats");
                    insertarMensajes(res);
                }
            });
        }
    }

    function insertarMensajes(res) {
        inicializarMensajes();
        let contadorInsertados = 0;
        for (let i = 0; i < mensajes.length; i++) {
            gestorBDChats.insertarMensaje(mensajes[i], function () {
                contadorInsertados++;
                if (contadorInsertados === mensajes.length) {
                    console.log("Se han añadido " + contadorInsertados + " mensajes");
                    let finReseteo = new Date();
                    console.log("---------------------------");
                    console.log("Tiempo empleado: " + ((finReseteo - inicioReseteo) / 1000) + " segundos");
                    res.send("Reseteo de la base de datos completado con éxito");
                }
            });
        }
    }

    function inicializarUsuarios() {
        usuario1 = {
            email: "CENSURADO PARA DESCLASIFICACIÓN@uniovi.es",
            name: "Lino",
            lastName: "CENSURADO PARA DESCLASIFICACIÓN",
            saldo: 100.0 - 11.6 - 24.0
        };
        usuario2 = {
            email: "cruzadaeterna@gmail.com",
            name: "Marshal",
            lastName: "Helbrecht",
            saldo: 100.0 - 4.3 - 20.0
        };
        usuario3 = {
            email: "armaggedon41@hotmail.com",
            name: "Sebastian",
            lastName: "Yarrick",
            saldo: 100.0 - 50.3 - 15.0
        };
        usuario4 = {
            email: "helsreach@yahoo.es",
            name: "Merek",
            lastName: "Grimaldus",
            saldo: 100.0 - 40.0 - 25.0
        };
        usuario5 = {
            email: "alpha-legion@gmail.com",
            name: "Sindri",
            lastName: "Myr",
            saldo: 100.0 - 20.0 - 15.5
        };
        usuarios = [usuario1, usuario2, usuario3, usuario4, usuario5];
    }

    function inicializarOfertas() {
        oferta11 = {
            title: "Espada toledana",
            description: "Puro acero templado en las forjas de Castilla",
            cost: 45.0,
            date: "2018-02-01",
            destacada: false,
            vendedor: usuario1._id,
            email: "CENSURADO PARA DESCLASIFICACIÓN@uniovi.es"
        };
        oferta12 = {
            title: "La Comunidad del Anillo",
            description: "Por JRR Tolkien, parte de la trilogía de ESDLA",
            cost: 20.0,
            date: "2019-03-01",
            destacada: false,
            vendedor: usuario1._id,
            comprador: usuario5._id,
            email: "CENSURADO PARA DESCLASIFICACIÓN@uniovi.es"
        };
        oferta13 = {
            title: "BMW 320i",
            description: "Siempre en garaje. Persona mayor y no fumadora. Muy buen estado",
            cost: 40.0,
            date: currentDate,
            destacada: false,
            vendedor: usuario1._id,
            comprador: usuario4._id,
            email: "CENSURADO PARA DESCLASIFICACIÓN@uniovi.es"
        };
        oferta21 = {
            title: "Guitarra española",
            description: "Marca Alhambra",
            cost: 35.99,
            date: "2018-03-10",
            destacada: false,
            vendedor: usuario2._id,
            email: "cruzadaeterna@gmail.com"
        };
        oferta22 = {
            title: "La Divina Comedia",
            description: "Clásico indiscutible de Dante Alighieri",
            cost: 11.6,
            date: "2019-03-04",
            destacada: false,
            vendedor: usuario2._id,
            comprador: usuario1._id,
            email: "cruzadaeterna@gmail.com"
        };
        oferta23 = {
            title: "TES III: Morrowind",
            description: "Edición GOTY",
            cost: 15.5,
            date: currentDate,
            destacada: false,
            vendedor: usuario2._id,
            comprador: usuario5._id,
            email: "cruzadaeterna@gmail.com"
        };
        oferta31 = {
            title: "Cadillac CTS-V",
            description: "2005, 250 CV",
            cost: 75.7,
            date: currentDate,
            destacada: false,
            vendedor: usuario3._id,
            email: "armaggedon41@hotmail.com"
        };
        oferta32 = {
            title: "Paraguas negro",
            description: "Ligeramente oxidado",
            cost: 4.3,
            date: "2019-03-01",
            destacada: false,
            vendedor: usuario3._id,
            comprador: usuario2._id,
            email: "armaggedon41@hotmail.com"
        };
        oferta33 = {
            title: "Motosierra",
            description: "Engrasada y lista para la acción",
            cost: 24.0,
            date: currentDate,
            destacada: false,
            vendedor: usuario3._id,
            comprador: usuario1._id,
            email: "armaggedon41@hotmail.com"
        };
        oferta41 = {
            title: "Relicario",
            description: "Manifestación material de la voluntad divina",
            cost: 1000.0,
            date: "2018-01-15",
            destacada: false,
            vendedor: usuario4._id,
            email: "helsreach@yahoo.es"
        };
        oferta42 = {
            title: "Gaita asturiana",
            description: "Fabricación artesanal por Varillas",
            cost: 50.3,
            date: "2019-03-03",
            destacada: false,
            vendedor: usuario4._id,
            comprador: usuario3._id,
            email: "helsreach@yahoo.es"
        };
        oferta43 = {
            title: "Nokia 3000",
            description: "Absolutamente indestructible",
            cost: 20.0,
            date: currentDate,
            destacada: false,
            vendedor: usuario4._id,
            comprador: usuario2._id,
            email: "helsreach@yahoo.es"
        };
        oferta51 = {
            title: "Yelmo templario",
            description: "Siglo XII. Perteneciente a la Orden de los Pobres Compañeros de Cristo y del Templo de Salomón.",
            cost: 30.7,
            date: "2018-01-04",
            destacada: false,
            vendedor: usuario5._id,
            email: "alpha-legion@gmail.com"
        };
        oferta52 = {
            title: "Cheytac Intervención",
            description: "Fusil de largo alcance.",
            cost: 25.0,
            date: "2019-08-17",
            destacada: false,
            vendedor: usuario5._id,
            comprador: usuario4._id,
            email: "alpha-legion@gmail.com"
        };
        oferta53 = {
            title: "Libro de salmos ucraniano",
            description: "Encontrado en Pripyat. Ligeramente irradiado.",
            cost: 15.0,
            date: currentDate,
            destacada: false,
            vendedor: usuario5._id,
            comprador: usuario3._id,
            email: "alpha-legion@gmail.com"
        };
        ofertas = [oferta11, oferta12, oferta13, oferta21, oferta22, oferta23, oferta31, oferta32, oferta33,
            oferta41, oferta42, oferta43, oferta51, oferta52, oferta53];
    }

    function inicializarChats() {
        chat112 = {
            creador: usuario2,
            vendedor: usuario1,
            oferta: oferta11
        };
        chat122 = {
            creador: usuario2,
            vendedor: usuario1,
            oferta: oferta12
        };
        chat132 = {
            creador: usuario2,
            vendedor: usuario1,
            oferta: oferta13
        };
        chat211 = {
            creador: usuario1,
            vendedor: usuario2,
            oferta: oferta21
        };
        chat221 = {
            creador: usuario1,
            vendedor: usuario2,
            oferta: oferta22
        };
        chat231 = {
            creador: usuario1,
            vendedor: usuario2,
            oferta: oferta23
        };
        chat311 = {
            creador: usuario1,
            vendedor: usuario3,
            oferta: oferta31
        };
        chat321 = {
            creador: usuario1,
            vendedor: usuario3,
            oferta: oferta32
        };
        chat331 = {
            creador: usuario1,
            vendedor: usuario3,
            oferta: oferta33
        };
        chat411 = {
            creador: usuario1,
            vendedor: usuario4,
            oferta: oferta41
        };
        chat421 = {
            creador: usuario1,
            vendedor: usuario4,
            oferta: oferta42
        };
        chat431 = {
            creador: usuario1,
            vendedor: usuario4,
            oferta: oferta43
        };
        chat511 = {
            creador: usuario1,
            vendedor: usuario5,
            oferta: oferta51
        };
        chat521 = {
            creador: usuario1,
            vendedor: usuario5,
            oferta: oferta52
        };
        chat531 = {
            creador: usuario1,
            vendedor: usuario5,
            oferta: oferta53
        };
        chats = [chat112, chat122, chat132, chat211, chat221, chat231, chat311, chat321, chat331,
            chat411, chat421, chat431, chat511, chat521, chat531];
    }

    function inicializarMensajes() {
        mensaje112a = crearMensaje(usuario2, usuario1, chat112._id, oferta11, 0);
        mensaje112b = crearMensaje(usuario1, usuario2, chat112._id, oferta11, 1);
        mensaje112c = crearMensaje(usuario2, usuario1, chat112._id, oferta11, 2);
        mensaje112d = crearMensaje(usuario1, usuario2, chat112._id, oferta11, 3);

        mensaje122a = crearMensaje(usuario2, usuario1, chat122._id, oferta12, 0);
        mensaje122b = crearMensaje(usuario1, usuario2, chat122._id, oferta12, 1);
        mensaje122c = crearMensaje(usuario2, usuario1, chat122._id, oferta12, 2);
        mensaje122d = crearMensaje(usuario1, usuario2, chat122._id, oferta12, 3);

        mensaje132a = crearMensaje(usuario2, usuario1, chat132._id, oferta13, 0);
        mensaje132b = crearMensaje(usuario1, usuario2, chat132._id, oferta13, 1);
        mensaje132c = crearMensaje(usuario2, usuario1, chat132._id, oferta13, 2);
        mensaje132d = crearMensaje(usuario1, usuario2, chat132._id, oferta13, 3);

        mensaje211a = crearMensaje(usuario1, usuario2, chat211._id, oferta21, 0);
        mensaje211b = crearMensaje(usuario2, usuario1, chat211._id, oferta21, 1);
        mensaje211c = crearMensaje(usuario1, usuario2, chat211._id, oferta21, 2);
        mensaje211d = crearMensaje(usuario2, usuario1, chat211._id, oferta21, 3);

        mensaje221a = crearMensaje(usuario1, usuario2, chat221._id, oferta22, 0);
        mensaje221b = crearMensaje(usuario2, usuario1, chat221._id, oferta22, 1);
        mensaje221c = crearMensaje(usuario1, usuario2, chat221._id, oferta22, 2);
        mensaje221d = crearMensaje(usuario2, usuario1, chat221._id, oferta22, 3);

        mensaje231a = crearMensaje(usuario1, usuario2, chat231._id, oferta23, 0);
        mensaje231b = crearMensaje(usuario2, usuario1, chat231._id, oferta23, 1);
        mensaje231c = crearMensaje(usuario1, usuario2, chat231._id, oferta23, 2);
        mensaje231d = crearMensaje(usuario2, usuario1, chat231._id, oferta23, 3);

        mensaje311a = crearMensaje(usuario1, usuario3, chat311._id, oferta31, 0);
        mensaje311b = crearMensaje(usuario3, usuario1, chat311._id, oferta31, 1);
        mensaje311c = crearMensaje(usuario1, usuario3, chat311._id, oferta31, 2);
        mensaje311d = crearMensaje(usuario3, usuario1, chat311._id, oferta31, 3);

        mensaje321a = crearMensaje(usuario1, usuario3, chat321._id, oferta32, 0);
        mensaje321b = crearMensaje(usuario3, usuario1, chat321._id, oferta32, 1);
        mensaje321c = crearMensaje(usuario1, usuario3, chat321._id, oferta32, 2);
        mensaje321d = crearMensaje(usuario3, usuario1, chat321._id, oferta32, 3);

        mensaje331a = crearMensaje(usuario1, usuario3, chat331._id, oferta33, 0);
        mensaje331b = crearMensaje(usuario3, usuario1, chat331._id, oferta33, 1);
        mensaje331c = crearMensaje(usuario1, usuario3, chat331._id, oferta33, 2);
        mensaje331d = crearMensaje(usuario3, usuario1, chat331._id, oferta33, 3);

        mensaje411a = crearMensaje(usuario1, usuario4, chat411._id, oferta41, 0);
        mensaje411b = crearMensaje(usuario4, usuario1, chat411._id, oferta41, 1);
        mensaje411c = crearMensaje(usuario1, usuario4, chat411._id, oferta41, 2);
        mensaje411d = crearMensaje(usuario4, usuario1, chat411._id, oferta41, 3);

        mensaje421a = crearMensaje(usuario1, usuario4, chat421._id, oferta42, 0);
        mensaje421b = crearMensaje(usuario4, usuario1, chat421._id, oferta42, 1);
        mensaje421c = crearMensaje(usuario1, usuario4, chat421._id, oferta42, 2);
        mensaje421d = crearMensaje(usuario4, usuario1, chat421._id, oferta42, 3);

        mensaje431a = crearMensaje(usuario1, usuario4, chat431._id, oferta43, 0);
        mensaje431b = crearMensaje(usuario4, usuario1, chat431._id, oferta43, 1);
        mensaje431c = crearMensaje(usuario1, usuario4, chat431._id, oferta43, 2);
        mensaje431d = crearMensaje(usuario4, usuario1, chat431._id, oferta43, 3);

        mensaje511a = crearMensaje(usuario1, usuario5, chat511._id, oferta51, 0);
        mensaje511b = crearMensaje(usuario5, usuario1, chat511._id, oferta51, 1);
        mensaje511c = crearMensaje(usuario1, usuario5, chat511._id, oferta51, 2);
        mensaje511d = crearMensaje(usuario5, usuario1, chat511._id, oferta51, 3);

        mensaje521a = crearMensaje(usuario1, usuario5, chat521._id, oferta52, 0);
        mensaje521b = crearMensaje(usuario5, usuario1, chat521._id, oferta52, 1);
        mensaje521c = crearMensaje(usuario1, usuario5, chat521._id, oferta52, 2);
        mensaje521d = crearMensaje(usuario5, usuario1, chat521._id, oferta52, 3);

        mensaje531a = crearMensaje(usuario1, usuario5, chat531._id, oferta53, 0);
        mensaje531b = crearMensaje(usuario5, usuario1, chat531._id, oferta53, 1);
        mensaje531c = crearMensaje(usuario1, usuario5, chat531._id, oferta53, 2);
        mensaje531d = crearMensaje(usuario5, usuario1, chat531._id, oferta53, 3);

        mensajes = [mensaje112a, mensaje112b, mensaje112c, mensaje112d, mensaje122a, mensaje122b, mensaje122c,
            mensaje122d, mensaje132a, mensaje132b, mensaje132c, mensaje132d, mensaje211a, mensaje211b, mensaje211c,
            mensaje211d, mensaje221a, mensaje221b, mensaje221c, mensaje221d, mensaje231a, mensaje231b, mensaje231c,
            mensaje231d, mensaje311a, mensaje311b, mensaje311c, mensaje311d, mensaje321a, mensaje321b, mensaje321c,
            mensaje321d, mensaje331a, mensaje331b, mensaje331c, mensaje331d, mensaje411a, mensaje411b, mensaje411c,
            mensaje411d, mensaje421a, mensaje421b, mensaje421c, mensaje421d, mensaje431a, mensaje431b, mensaje431c,
            mensaje431d, mensaje511a, mensaje511b, mensaje511c, mensaje511d, mensaje521a, mensaje521b, mensaje521c,
            mensaje521d, mensaje531a, mensaje531b, mensaje531c, mensaje531d];
    }

    function crearMensaje(autor, destinatario, chat, oferta, nMensaje) {
        let m1 = "Hola " + destinatario.name + ", yo soy " + autor.name;
        let m2 = "Mi oferta es muy interesante: " + oferta.title;
        let m3 = "La quiero comprar";
        let m4 = "Perfecto";
        let mensajes = [m1, m2, m3, m4];
        let horaBase = new Date();
        let hora = horaBase.setMinutes(horaBase.getMinutes() + nMensaje);
        return {
            autor: autor._id,
            hora: new Date(hora),
            text: mensajes[nMensaje],
            leido: false,
            chat: chat
        }
    }

};