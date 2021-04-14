"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = __importDefault(require("./clases/server"));
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
//consulta de prueba
connection.query('select  concat(file_url, file_name) as image from product_images; ', (err, rows) => {
    if (err)
        throw err;
    console.log('data received from db');
    console.log(rows);
});
