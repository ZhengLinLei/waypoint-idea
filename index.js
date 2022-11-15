const express = require('express');

// GET CONFIG
const config = require('./server/config');
// CALL DATABASE
// require('./server/database');

// GENERATE SERVER
const app = config(express());


// CALL SERVER
app.listen(app.get('port') , ()=> console.log(`Port in ${app.get('port')}`));