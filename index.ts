import bodyParser from "body-parser";
import Server from "./clases/server";
import inicioRutas from "./rutas/inicio";
import thumbnailRutas from "./rutas/thumbnail";

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

//Body parser   
server.app.use(bodyParser.urlencoded({extended: true}));
server.app.use(bodyParser.json());

//views
// server.app.set('views', path.join(__dirname, 'views'));
server.app.set('view engine', 'ejs');
//rutas
server.app.use('/', inicioRutas);
server.app.use('/thumbnail', thumbnailRutas);