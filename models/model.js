// LOAD DATABASE

let db = require('../server/database');


const model = {}


model.getSiteInfo = (table, limit, fnc) => {
    db.all('SELECT * FROM `'+table+'` LIMIT '+limit, [], fnc);

}
model.getSiteRandom = (fnc) => {
    db.get('SELECT * FROM `restaurants` ORDER BY RANDOM() LIMIT 1', [], (err, row1) => {
        db.get('SELECT * FROM `hotels` ORDER BY RANDOM() LIMIT 1', [], (err, row2) => {
            db.get('SELECT * FROM `tpoints` ORDER BY RANDOM() LIMIT 1', [], (err, row3) => {
                fnc([row1, row2, row3]);
            });
        });
    });
}

model.getSiteSearch = (query, fnc) => {
    db.all('SELECT * FROM `restaurants` WHERE `Name` LIKE "%'+query+'%"', [], (err, row1) => {
        db.all('SELECT * FROM `hotels` WHERE `Name` LIKE "%'+query+'%"', [], (err, row2) => {
            db.all('SELECT * FROM `tpoints` WHERE `Name` LIKE "%'+query+'%"', [], (err, row3) => {
                fnc([row1, row2, row3]);
            });
        });
    });
}

module.exports = model;