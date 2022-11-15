const express = require('express');
const router = express.Router();

const controller = require('../controllers/controller');


module.exports = app => {
    // GENERATE APP ROUTES
    router.get('/', controller.getIndex);
    

    app.use(router)
}