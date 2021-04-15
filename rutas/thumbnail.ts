import express from 'express';
import { Router, Request, Response } from 'express';

const mysql = require('mysql');
const bodyParser = require('body-parser'); 

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'purchasing'
});

var oApp = express(); 
oApp.use(bodyParser.json());
oApp.use(bodyParser.urlencoded({ extended: true }));

const thumbnailRutas = Router();
//saca la api 
// thumbnailRutas.get('/images_api', (req: Request, res: Response) => {
//     const sql = 'select  concat(file_url, file_name) as image from product_images; ';
//     connection.query(sql, function(oError: any, oRows: any, oCols: any) {
//         if(oError) {
//         res.write(JSON.stringify({
//             error: true,
//             error_object: oError         
//         }));
//         res.end();
//         } else {
//         res.write(JSON.stringify(oRows));
//         res.end();
//         }
//     });
// });

// thumbnailRutas.get('/', function(req, res, next){
//     const sql = 'select  concat(file_url, file_name) as image from product_images; ';
//     connection.query(sql, function(err: any, rows: any) {
//         if(err) {
//             res.render('pages/index', {data: ''});
//         } else {
//             res.render('pages/index', {data: rows});
//         }
//     })
// })

// thumbnailRutas.get('/images_api', (req: any, res: Response) => {
//     const images = await images.find()
//         .exc
// });

export default thumbnailRutas;