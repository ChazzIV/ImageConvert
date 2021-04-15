import express from 'express';
import { Router, Request, Response } from 'express';

const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'purchasing'
});

const bodyParser = require('body-parser'); 

var oApp = express(); 
oApp.use(bodyParser.json());
oApp.use(bodyParser.urlencoded({ extended: true }));

const sharp = require('sharp');

const inicioRutas = Router();

inicioRutas.get('/', function(req, res, next){
    const limit = 30;
    const page: any = req.query.page;
    const offset = (page -1) * limit;
    const sql = 'select option_id ,image_id as id ,concat(file_url, file_name) as image from product_images order by id desc limit 30;';   
    connection.query(sql, function(err: any, rows: any) {
        if(err) {
            res.render('pages/index', {data: ''});
        } else {
            res.render('pages/index', {data: rows});
        }
    });
});


// toma el id 
inicioRutas.get('/edit/(:id)', function(req, res, next) {

    let id = req.params.id;
   
    connection.query('SELECT * FROM product_images WHERE image_id = ' + id, function(err: any, rows: any, fields: any) {
        if(err) throw err
         
        // if user not found
        if (rows.length <= 0) {
            res.redirect('pages/index')
        }
        // if book found
        else {
            // render to edit.ejs
            res.render('pages/edit');
        }
    });
});

export default inicioRutas;