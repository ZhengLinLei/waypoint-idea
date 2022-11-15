const path = require('path');
const hbs = require('express-handlebars');

const morgan = require('morgan');
const multer = require('multer');
const cookieParser = require("cookie-parser");


const express = require('express');
const routes = require('../routes');

const errorHandler = require('errorhandler');

module.exports = app =>{
    // SERVER CONFIG-----------

    // SET GLOBAL VARIABLES
    app.set('env', 'dev'); // dev | prod
    app.set('port', process.env.PORT || 3000); // IN PRODUCTION MUST CHANGE THIS PORT TO 80
    app.set('views', path.join(__dirname, '../views')); // ABSOLUTE PATH OF THE VIEWS FOLDER
    app.set('view engine', '.hbs'); // VIEW RENDER ENGINE


    // ------------------------
    // VIEWS ENGINE
    app.engine(app.get('view engine'), hbs.engine({
        defaultLayout: 'template',
        partialsDir: path.join(app.get('views'), 'partials'),
        layoutsDir: path.join(app.get('views'), 'layouts'),
        extname: app.get('view engine'),
        helpers: require('./helpers.hbs')
    }));


    // MIDDLEWARE
    app.use(morgan(app.get('env'))); // CHANGE IT TO ANOTHER IN PRODUCTION
    // app.use(
    //     multer({
    //         dest: path.join(__dirname, '../public/upload/temp') // PATH TO SAVE THE TEMPORAL IMAGE UPLOADED
    //     })
    //     .single('image') // NAME OF THE SINGLE FILE UPLOADED
    // );

    app.use(express.urlencoded({
        extended: true
    }));
    app.use(express.json());
    app.use(cookieParser());

    // ROUTES
    routes(app);

    // STATIC FILES
    app.use('/static', express.static(path.join(__dirname, '../public')));

    // ERROR HANDLER
    if('dev' === app.get('env')){
        // ACTIVATE ERROR HANDLER
        app.use(errorHandler)
    }


    // ------------------------
    // RETURN ALL CONFIG TO THE MAIN FILE
    return app;
}