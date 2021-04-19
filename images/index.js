"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = __importDefault(require("./clases/server"));
const multer = require('multer');
const sharp = require('sharp');
const fs = require("fs");
const got = require("got");
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
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
    var bitmap = fs.readFileSync(`images/uploads/thumbnails/${file}`, { encoding: 'base64' });
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
var n1 = 0;
var n2 = 500;
const sql = 'select product_options.option_id as id,product_options.sku as sku, concat(product_images.file_url, product_images.file_name) as image from product_options inner join product_images on product_images.option_id  = product_options.option_id where product_options.option_id between ' + n1 + ' and ' + n2;
//where product_images.image_id= 4591
//order by id desc limit 5
// consulta de prueba
connection.query(sql, (err, rows, response) => {
    if (err)
        throw err;
    const imageURL = "https://andalegrupo.com/catalogs/";
    // console.log('data received from db');
    rows.forEach(function (row) {
        let sku = row.sku;
        let id = row.id;
        let thumbnail_name = `thumbnail-${sku}.jpg`;
        let name;
        let thumbnail_nosku = `thumbnail-${id}.jpg`;
        let thumbnail_file = `images/uploads/thumbnails/`;
        let has_sku;
        let process;
        let created_at = getTime();
        var thumbnail_noimage;
        var image_url = `${imageURL}${row.image}`;
        function checkImage(image_url) {
            var request = new XMLHttpRequest();
            request.open("GET", image_url, true);
            request.send();
            request.onload = function () {
                let status = request.status;
                if (request.status == 200) //if(statusText == OK)
                 {
                    const sharpStream = sharp({
                        failOnError: false
                    });
                    const promises = [];
                    //si no tiene sku la imagen se guarda con el id.jpg
                    if (sku === null) {
                        promises.push(sharpStream
                            .clone()
                            .resize({ width: 250 })
                            .resize({ height: 250 })
                            .jpeg({ quality: 80 })
                            .toFile(`${thumbnail_file}${thumbnail_nosku}`));
                        name = thumbnail_nosku;
                    }
                    else {
                        promises.push(sharpStream
                            .clone()
                            .resize({ width: 250 })
                            .resize({ height: 250 })
                            .jpeg({ quality: 80 })
                            .toFile(`${thumbnail_file}${thumbnail_name}`));
                        name = thumbnail_name;
                    }
                    // console.log("exist");
                    got.stream(image_url).pipe(sharpStream);
                    Promise.all(promises)
                        .then(res => {
                        //  console.log("Done!", res);
                        // convierte la imagen a base64 dependiendo si tiene sku o no cambia su nombre
                        if (sku === null) {
                            var base64str = base64_encode(`${thumbnail_nosku}`);
                        }
                        else {
                            var base64str = base64_encode(`${thumbnail_name}`);
                        }
                        // console.log(base64str);
                        //query insert
                        // si no tiene sku guarda un 0 y si tiene sku guarda un 1
                        if (sku === null)
                            has_sku = 0;
                        else
                            has_sku = 1;
                        // si la imagen fue procesada guarda un 1
                        process = 1;
                        var form_data = {
                            option_id: id,
                            thumbs_name: name,
                            thumbs_file: thumbnail_file,
                            has_sku: has_sku,
                            process: process,
                            base64: base64str,
                            created_at: created_at
                        };
                        // console.log(values);
                        connection.query("INSERT INTO product_thumbs set ?", [form_data], function (err, res) {
                            if (err) {
                                console.log("error: ", err);
                                res(err, null);
                            }
                            else {
                                var iIDCreated = res.insertId;
                                response.iIDCreated;
                            }
                        });
                    })
                        .catch(err => {
                        console.error("Error", err);
                        try {
                            fs.unlinkSync(`${sku}.jpg`);
                        }
                        catch (e) { }
                    });
                }
                else {
                    // console.log("image doesn't exist");
                    if (sku === null)
                        thumbnail_name = `${id}.jpg`;
                    else
                        thumbnail_name = thumbnail_name;
                    if (sku === null)
                        has_sku = 0;
                    else
                        has_sku = 1;
                    var form_data = {
                        option_id: id,
                        thumbs_name: thumbnail_name,
                        thumbs_file: thumbnail_file,
                        has_sku: has_sku,
                        process: 0,
                        base64: 0,
                        created_at: created_at
                    };
                    var values = [form_data];
                    // console.log(values);
                    connection.query("INSERT INTO product_thumbs set ?", values, function (err, res) {
                        if (err) {
                            console.log("error: ", err);
                            res(err, null);
                        }
                        else {
                            var iIDCreated = res.insertId;
                            response.iIDCreated;
                        }
                    });
                }
            };
        }
        checkImage(image_url);
        // console.log(rows[0].image);  
    });
    // //views
    // // server.app.set('view engine', 'ejs');
    // //rutas
    // // server.app.use('/', inicioRutas);
    // });
});
// //views
// // server.app.set('view engine', 'ejs');
// //rutas
// // server.app.use('/', inicioRutas);
// });
