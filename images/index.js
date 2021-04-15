"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const body_parser_1 = __importDefault(require("body-parser"));
const server_1 = __importDefault(require("./clases/server"));
const inicio_1 = __importDefault(require("./rutas/inicio"));
const thumbnail_1 = __importDefault(require("./rutas/thumbnail"));
const server = new server_1.default();
// levanta el servidor
server.start(() => {
    console.log(`Servidor image corriendo en el puerto ${server.port}`);
});
//conectando a la base de datos
const mysql = require('mysql');
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'purchasing'
});
connection.connect((err) => {
    if (err)
        throw err;
    console.log('conectado a mysql');
});
//Body parser   
server.app.use(body_parser_1.default.urlencoded({ extended: true }));
server.app.use(body_parser_1.default.json());
//views
// server.app.set('views', path.join(__dirname, 'views'));
server.app.set('view engine', 'ejs');
//rutas
server.app.use('/', inicio_1.default);
server.app.use('/thumbnail', thumbnail_1.default);
