var express = require('express');
var app = express();

const DURACION_TOKEN = 1800; // segundos

var jwt = require('jsonwebtoken');
app.set('jwt', jwt);

var expressSession = require('express-session');
app.use(expressSession({secret: 'abcdefg', resave: false, saveUninitialized: true}));
var crypto = require('crypto');

var swig = require('swig');
var mongo = require('mongodb');

var fs = require('fs');
var https = require('https');

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

const log4js = require('log4js');
log4js.configure({
    appenders: { logger: { type: 'file', filename: 'logger.log' } },
    categories: { default: { appenders: ['logger'], level: 'info' } }
});

const logger = log4js.getLogger('logger');

var gestorBDUsuarios = require("./modules/gestorBDUsuarios.js");
gestorBDUsuarios.init(app, mongo);
var gestorBDOfertas = require("./modules/gestorBDOfertas.js");
gestorBDOfertas.init(app, mongo);
var gestorBDChats = require("./modules/gestorBDChats.js");
gestorBDChats.init(app, mongo);

var routerUsuarioNoSession = express.Router();
routerUsuarioNoSession.use(function (req, res, next) {
    console.log("routerUsuarioNoSession");
    if (!req.session.usuario) {
        logger.info('Non logged in tries to access '+ req.originalUrl);
        next();
    } else {
        logger.info('User logged in tries to access '+ req.originalUrl);
        res.redirect("/home");
    }
});
//AplicarrouterUsuarioSession
app.use("/identificarse", routerUsuarioNoSession);
app.use("/registrarse", routerUsuarioNoSession);

var routerUsuarioSession = express.Router();
routerUsuarioSession.use(function (req, res, next) {
    console.log("routerUsuarioSession");
    if (req.session.usuario) {
        logger.info('User logged in tries to access '+ req.originalUrl);
        next();
    } else {
        logger.warn("Non logged in user tries to access" + req.originalUrl);
        res.redirect("/identificarse");
    }
});
//AplicarrouterUsuarioSession
app.use("/home", routerUsuarioSession);
app.use("/desconectarse", routerUsuarioSession);
app.use("/offer/*", routerUsuarioSession);
app.use("/user/*", routerUsuarioSession);
app.use("/chat/*", routerUsuarioSession);

var routerUsuarioAdmin = express.Router();
routerUsuarioAdmin.use(function (req, res, next) {
    console.log("routerUsuarioAdmin");
        if ("ADMINISTRADOR" === req.session.usuario.rol) {
            logger.info('Administrator tries to access '+ req.originalUrl);
            next();
        } else {
            logger.warn("User " + req.session.usuario.email + "tries to access Administrator-restricted"
                + req.originalUrl);
            res.redirect("/home");
        }
});
//Aplicar routerUsuarioAdmin
app.use("/user/delete/*", routerUsuarioAdmin);
app.use("/user/list", routerUsuarioAdmin);

var routerUsuarioEstandar = express.Router();
routerUsuarioEstandar.use(function (req, res, next) {
    console.log("routerUsuarioEstandar");
    if ("ESTANDAR" === req.session.usuario.rol) {
        logger.info('Standard user tries to access '+ req.originalUrl);
        next();
    } else {
        logger.warn("Admin " + req.session.usuario.email + "tries to access Standard-restricted" + req.originalUrl);
        res.redirect("/home");
    }
});
//Aplicar routerUsuarioAdmin
app.use("/offer/*", routerUsuarioEstandar);
app.use("/chat/*", routerUsuarioEstandar);

// routerApiToken
var routerApiToken = express.Router();
routerApiToken.use(function(req, res, next) {
// obtener el token, vía headers (opcionalmente GET y/o POST).
    var token = req.headers['token'] || req.body.token || req.query.token;
    if (token != null) {
        // verificar el token
        jwt.verify(token, 'secreto', function(err, infoToken) {
            if (err || (Date.now()/1000 - infoToken.tiempo) > DURACION_TOKEN ){
                res.status(403); // Forbidden
                res.json({
                    acceso : false,
                    error: 'Token invalido o caducado'
                });
// También podríamos comprobar que intoToken.usuario existe
            } else {
// dejamos correr la petición
                res.usuario = infoToken.usuario;
                res.id = gestorBDUsuarios.mongo.ObjectID(infoToken.id);
                next();
            }
        });
    } else {
        res.status(403); // Forbidden
        res.json({
            acceso : false,
            mensaje: 'No hay Token'
        });
    }
});
// Aplicar routerApiToken
app.use('/api/oferta*', routerApiToken);
app.use('/api/mensaje*', routerApiToken);
app.use('/api/mensajeleido*', routerApiToken);
app.use('/api/chat*', routerApiToken);

app.use(express.static('public'));

app.set('port', 8080);
app.set('db', 'mongodb://...');
app.set('clave', 'abcdefg');
app.set('crypto', crypto);

require("./routes/rusuarios.js")(app, swig, gestorBDUsuarios, gestorBDOfertas, logger);
require("./routes/rofertas.js")(app, swig, gestorBDOfertas, gestorBDUsuarios, logger);
require("./routes/rdatosPrueba.js")(app, swig, gestorBDUsuarios, gestorBDOfertas, gestorBDChats, logger);
require("./routes/rapichat.js")(app, swig, gestorBDUsuarios, gestorBDOfertas, gestorBDChats, logger);

app.use(function (err, req, res) {
    console.log("Error producido: " + err);
    if (!res.headersSent) {
        //res.status(400);
        logger.error("Resource not available");
        //res.send("Recurso no disponible");
        console.log("Recurso no disponible");
    }
});

https.createServer({
    key: fs.readFileSync('certificates/c.key'),
    cert: fs.readFileSync('certificates/c.crt')
}, app).listen(app.get('port'), function () {
    console.log("Servidor activo");
});