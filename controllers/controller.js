const model = require('../models/model')


const controller = {};


controller.getIndex = (req, res) => {
    // INDEX PAGE
    // if(req.cookies.welcomeSection == undefined){
    //     res.cookie('welcomeSection', 'true', { expires: new Date(Number(new Date()) + (10 * 365 * 24 * 60 * 60 * 1000)), httpOnly: true }); // Expires in 10 years
    //     // res.render('index', {firstTime: true});
    //     res.send('firstTime');
    // }else{
    //     res.render('index');
    // }
    res.render('index');

}

controller.getSiteInfo = (req, res) => {
    model.getSiteInfo(req.params.type, req.params.limit, (err, row) => {
        if(err){
            console.log(err);
        }else{
            res.json(row);
        }
    });
}

controller.getSiteRandom = (req, res) => {
    model.getSiteRandom((rows) => {
        res.json(rows);
    });
}

controller.getSiteSearch = (req, res) => {
    model.getSiteSearch(req.params.query, (rows) => {
        res.json(rows);
    });
}

module.exports = controller;