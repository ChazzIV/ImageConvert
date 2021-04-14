import Server from "./clases/server";

const server = new Server();


// levanta el servidor
server.start( () => {
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

connection.connect((err: any) => {
    if (err) throw err;
    console.log('conectado a mysql');
});


//consulta de prueba

connection.query('select  concat(file_url, file_name) as image from product_images; ', (err: any, rows: any) => {
    if(err) throw err;

    console.log('data received from db');
    console.log(rows);
});