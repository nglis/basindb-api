// Require libraries
const axios = require('axios')
const cheerio = require('cheerio')
const express = require('express')

// Load config
const config = require('./config/config')

// Load services
const services = require('./services/services')

// Load endpoints
const apiRoutes = require('./api-routes/api-routes')

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

const dataRows = services.loadData();

// This is a test API for scraping data directly off the BASIN database
app.get('/info', (req, res) => {
    try {
        res.json(
            {
                lastRelease: dateFormatted,
                info: 'Thanks for using the BASIN DB API. Data retrieved using this API is up to date according to the BASIN DB website.'
            }
        )
    } catch (err) {
        console.log(err)
    }
})

app.get('/wells', async (req, res) => {
    try {
        res.json({dataRows})

    } catch (err) {
        console.log(err)
    }

})

app.listen(config.PORT, () => console.log('SERVER RUNNING ON PORT ', config.PORT))