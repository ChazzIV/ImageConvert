"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = __importDefault(require("./clases/server"));
const inicio_1 = __importDefault(require("./rutas/inicio"));
const thumbnail_1 = __importDefault(require("./rutas/thumbnail"));
const multer = require('multer');
const sharp = require('sharp');
const fs = require("fs");
const got = require("got");
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
// Body parser   
// server.app.use(bodyParser.urlencoded({extended: true}));
// server.app.use(bodyParser.json());
//Multer
// const storage = multer.diskStorage({
//     destination: (req: any, file: any, cb: any) => {
//         cb(null, 'resourses/thumbnail');
//     },
//     filename: (req: any, file: any, cb: any) => {
//         console.log(file);
//         cb(null, Date.now() + path.extname(file.originalname));
//     }
// });
// const fileFilter = (req: any, file: any, cb: any) => {
//     if (file.mimetype == 'image/jpeg' || file.mimetype == 'image/png') {
//         cb(null, true);
//     } else {
//         cb(null, false);
//     }
// }
// const upload = multer({ storage: storage, fileFilter: fileFilter });
//function to encode file data to base64 encoded string
function base64_encode(file) {
    // read binary data
    var bitmap = fs.readFileSync(`uploads/thumbnails/${file}`, { encoding: 'base64' });
    // convert binary data to base64 encoded string
    return bitmap.toString('base64');
}
// function to create file from base64 encoded string
// function base64_decode(base64str: any, file: any) {
//     // create buffer object from base64 encoded string, it is important to tell the constructor that the string is base64 encoded
//     // var bitmap = Buffer.from(base64str, 'base64');
//     var bitmap = Buffer.from(base64str, 'base64');
//     // write buffer to file
//     fs.writeFileSync(file, bitmap);
// }
// función para el created_at
function getTime() {
    var date = new Date();
    var year = date.getFullYear();
    var month = (date.getMonth() + 1);
    var day = date.getDate();
    var hour = date.getHours();
    var minute = date.getMinutes();
    var second = date.getSeconds();
    return formateTime(year, month, day, hour, minute, second);
}
function formateTime(year, month, day, hour, minute, second) {
    return makeDoubleDigit(year) + "-" +
        makeDoubleDigit(month) + "-" +
        makeDoubleDigit(day) + " " +
        makeDoubleDigit(hour) + ":" +
        makeDoubleDigit(minute) + ":" +
        makeDoubleDigit(second);
}
function makeDoubleDigit(x) {
    return (x < 10) ? "0" + x : x;
}
// SQL
const sql = 'select product_images.image_id as id ,product_options.sku as sku, concat(product_images.file_url, product_images.file_name) as image from product_options inner join product_images on product_images.option_id  = product_options.option_id order by id desc limit 1;';
//consulta de prueba
connection.query(sql, (err, rows, response) => {
    if (err)
        throw err;
    const imageURL = "https://andalegrupo.com/catalogs/";
    // console.log('data received from db');
    rows.forEach(function (row) {
        let sku = row.sku;
        let id = row.id;
        let thumbnail_name = `thumbnail-${sku}.jpg`;
        let thumbnail_file = `images/uploads/thumbnails/`;
        // let h_sku: boolean = sku.length > 0 ? has_sku = 1 : has_sku = 0;
        let has_sku;
        let process;
        let created_at = getTime();
        const sharpStream = sharp({
            failOnError: false
        });
        const promises = [];
        promises.push(sharpStream
            .clone()
            .resize({ width: 250 })
            .resize({ height: 250 })
            .jpeg({ quality: 80 })
            .toFile(`${thumbnail_file}${thumbnail_name}`));
        got.stream(`${imageURL}` + row.image).pipe(sharpStream);
        Promise.all(promises)
            .then(res => {
            //  console.log("Done!", res);
            // convert image to base64 encoded string
            // var base64str = base64_encode(`${thumbnail_file}${thumbnail_name}`);
            var base64str = base64_encode(`${thumbnail_name}`);
            // console.log(base64str);
            // console.log(base64str);
            //query insert
            if (sku.length > 0)
                has_sku = 1;
            else
                has_sku = 0;
            if (promises)
                process = 1;
            else
                process = 0;
            var form_data = {
                option_id: id,
                thumbs_name: thumbnail_name,
                thumbs_file: thumbnail_file,
                has_sku: has_sku,
                process: process,
                base64: base64str,
                created_at: created_at
            };
            var values = [form_data];
            //console.log(values);
            // connection.query("INSERT INTO product_thumbs set ?", values, function (err: any, res: any) {
            //     if(err) {
            //         console.log("error: ", err);
            //         res(err, null);
            //     }
            //     else{
            //         var iIDCreated = res.insertId;
            //         response.iIDCreated
            //         // console.log(res.insertId);
            //         // res(null, res.insertId);
            //     }
            // })
        })
            .catch(err => {
            console.error("Error", err);
            try {
                fs.unlinkSync(`${sku},jpg`);
            }
            catch (e) { }
        });
    });
    // console.log(rows[0].image);    
});
//views
// server.app.set('views', path.join(__dirname, 'views'));
server.app.set('view engine', 'ejs');
//rutas
server.app.use('/', inicio_1.default);
server.app.use('/thumbnail', thumbnail_1.default);
