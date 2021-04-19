"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const express_2 = require("express");
const mysql = require('mysql');
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'purchasing'
});
const bodyParser = require('body-parser');
//bodyparser
var oApp = express_1.default();
oApp.use(bodyParser.json());
oApp.use(bodyParser.urlencoded({ extended: true }));
// fileupload 
//multer
const sharp = require('sharp');
const multer = require('multer');
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/thumbnails');
    },
    filename: (req, file, cb) => {
        console.log(file);
        cb(null, Date.now() + path_1.default.extname(file.originalname));
    }
});
const fileFilter = (req, file, cb) => {
    if (file.mimetype == 'image/jpeg' || file.mimetype == 'image/png') {
        cb(null, true);
    }
    else {
        cb(null, false);
    }
};
const upload = multer({ storage: storage, fileFilter: fileFilter });
const inicioRutas = express_2.Router();
inicioRutas.get('/', function (req, res, next) {
    // const limit = 30;
    // const page: any = req.query.page;
    // const offset = (page -1) * limit;
    const sql = 'select product_images.image_id as id ,product_options.sku as sku, concat(product_images.file_url, product_images.file_name) as image from product_options inner join product_images on product_images.option_id  = product_options.option_id order by id desc limit 200;';
    connection.query(sql, function (err, rows) {
        if (err) {
            res.render('pages/index', { data: '' });
        }
        else {
            res.render('pages/index', { data: rows });
        }
    });
});
// toma el id 
inicioRutas.get('/edit/(:id)', function (req, res, next) {
    let id = req.params.id;
    connection.query('select product_images.image_id as id ,product_options.sku as sku, concat(product_images.file_url, product_images.file_name) as image from product_options inner join product_images on product_images.option_id  = product_options.option_id where product_images.image_id = ' + id, function (err, rows, fields) {
        if (err)
            throw err;
        // if user not found
        if (rows.length <= 0) {
            res.redirect('pages/index');
        }
        // if book found
        else {
            // render to edit.ejs
            res.render('pages/edit', {
                id: rows[0].id,
                sku: rows[0].sku,
                image: rows[0].image
            });
        }
    });
});
inicioRutas.post('/update/:id', (req, res, next) => {
    let id = req.params.id;
    const pathThmb = '/resources/thumbnail/';
    let thumbs_url = pathThmb;
    let has_sku = req.params.has_sku;
    let thumbs_name = 'thumbnail-' + has_sku;
    let process = req.params.process;
    // let option_id = req.body.option_id;
    let errors = false;
    // if( id.length === 0 || thumbs_name.length === 0 || thumbs_url.length === 0 || process.lengt === 0 || has_sku.length === 0 ) {
    //         errors = true;
    //         res.render('pages/edit');
    // }
    var form_data = {
        id: id,
        thumbs_name: thumbs_name,
        thumbs_url: thumbs_url,
        process: process,
        has_sku: has_sku
    };
    console.log(form_data);
    //sharp 
    // sharp(req.file.path).resize(200, 200).toFile('resources/thumbail' + 'thumbnail-' + req.file.originalname, (err: any, resizeImage: any) => {
    //     if (err) {
    //         console.log(err);
    //     } else {
    //         console.log(resizeImage);
    //     }
    // });
    //query insert 
    connection.query('insert into product_thumbs set ? ', form_data, (err, result) => {
        if (err) {
            res.render('pages/edit', {
                id: req.params.id,
                has_sku: req.params.has_sku,
                thumbs_name: req.params.thumbs_name,
                thumbs_url: req.params.thumbs_url,
                process: req.params.process
            });
        }
        else {
            res.redirect('pages/index');
        }
    });
});
inicioRutas.get('/add', (req, res, next) => {
    res.render('pages/add', {
        option_id: '',
        thumbs_name: '',
        thumbs_url: '',
        process: '',
        has_sku: ''
    });
});
inicioRutas.get('/add', (req, res, next) => {
    let option_id = req.body.option_id;
    let thumbs_name = req.body.thumbs_name;
    let thumbs_url = req.body.thumbs_url;
    let process = req.body.process;
    let has_sku = req.body.has_sku;
    var form_data = {
        option_id: option_id,
        thumbs_name: thumbs_name,
        thumbs_url: thumbs_url,
        process: process,
        has_sku: has_sku
    };
});
exports.default = inicioRutas;
// display edit book page
// router.get('/edit/(:id)', function(req, res, next) {
//     let id = req.params.id;
//     dbConn.query('SELECT * FROM books WHERE id = ' + id, function(err, rows, fields) {
//         if(err) throw err
//         // if user not found
//         if (rows.length <= 0) {
//             req.flash('error', 'Book not found with id = ' + id)
//             res.redirect('/books')
//         }
//         // if book found
//         else {
//             // render to edit.ejs
//             res.render('books/edit', {
//                 title: 'Edit Book', 
//                 id: rows[0].id,
//                 name: rows[0].name,
//                 author: rows[0].author
//             })
//         }
//     })
// })
