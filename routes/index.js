const express = require('express');
const router = express.Router();

const controller = require('../controllers/controller');


module.exports = app => {
    // GENERATE APP ROUTES
    router.get('/', controller.getIndex);
    router.get('/add', controller.getAddNew);
    router.get('/item', controller.getItemList);
    router.get('/item/:barcode', controller.getItemBarcode); //API
    // router.get('/image/:idImage', controller.image);
    // //
    router.post('/post/addNew', controller.postAddNew)
    // router.post('/image', imageCtrl.create);
    // router.post('/image/:idImage/like', controller.index);
    // router.post('/image/:idImage/comment', controller.index);
    // //
    // router.put('/image', controller.index);

    app.use(router)
}