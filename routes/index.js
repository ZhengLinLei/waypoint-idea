const express = require('express');
const router = express.Router();

const controller = require('../controllers/controller');


module.exports = app => {
    // GENERATE APP ROUTES
    router.get('/', controller.getIndex);
    
    // API
    router.get('/api/search/:query', controller.getSiteSearch);
    router.get('/api/random', controller.getSiteRandom);
    router.get('/api/:type/:limit', controller.getSiteInfo);

    // If route doesn't exist, return 404
    router.all('*', (req, res) => {
        res.status(404).send('Que haces aquí? Fuera de aquí!');
    });

    // API TABLES
    // resturants, hotels, tpoints

    app.use(router)
}