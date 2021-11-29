// Require libraries
const express = require('express')

// Load config
const config = require('./config/config')

// Load services
const services = require('./services/services')

// Loads certificates for BASIN DB
const rootCas = require('ssl-root-cas').create();
rootCas
    .addFile(config.BASIN_CERT_LOC)
    .addFile(config.ENTRUST_CERT_LOC)
    .addFile(config.ENTRUST_ROOT_LOC);
require('https').globalAgent.options.ca = rootCas;

// Initialize Express app
const app = express()

const date = new Date()
const dateFormatted = date.toISOString()

// IIFE loads data then passes is to the api endpoints
let data = {
    lastUpdated: dateFormatted,
    wellData: null
};

(async function() {
    // Handle all initial data loading in this service
    data.wellData = await services.loadWellData()

    // Load api endpoints once well data is loaded
    require('./api-routes/api-routes')(app, data)
})()

app.listen(config.PORT, () => console.log('SERVER RUNNING ON PORT ', config.PORT))