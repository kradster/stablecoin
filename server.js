const express = require('express');
const logger = require('morgan');
const path = require('path')
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const ejs = require('ejs');
const flash    = require('connect-flash');
var session = require('express-session');
var cors = require('cors')

var dotenv = require('dotenv').config({path: __dirname + '/.env'});

// Set up the express app
const app = express();
app.use(cors());
global.config = require('./configuration');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '')));

app.engine('html', ejs.renderFile);
app.set('client', path.join(__dirname, '/file'));
app.set('view engine', 'html');
app.use(cookieParser());
app.use(flash());
app.use(express.static(path.join(__dirname, '/client')));

app.use('/css', express.static(path.resolve(__dirname, './client/public/css')));
app.use('/images', express.static(path.resolve(__dirname, './client/public/img')));
app.use('/js', express.static(path.resolve(__dirname, './client/public/js')));
app.use('/fonts', express.static(path.resolve(__dirname, './client/public/fonts')));
app.use('/build', express.static(path.resolve(__dirname, './build')));
app.use(logger('dev'));
require('./routes')(app);

app.get('*', function (req, res){
   res.sendFile('index.html', { root: path.join(__dirname, './client/public/html') });
})

console.log("env ===",process.env.port)
app.listen(process.env.port,()=>{console.log("Server is up and listen on port ",process.env.port)})
module.exports = app;
