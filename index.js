const PORT = process.env.PORT || 8000

var rootCas = require('ssl-root-cas').create();
 
rootCas
  .addFile(__dirname + '/ssl/basin_cert.pem')
  .addFile(__dirname + '/ssl/entrust_cert.pem')
  .addFile(__dirname + '/ssl/entrust_root.pem')
  ;
 
// will work with all https requests will all libraries (i.e. request.js)
require('https').globalAgent.options.ca = rootCas;

const axios = require('axios')
const cheerio = require('cheerio')
const express = require('express')

const app = express()

const date = new Date()
const dateFormatted = date.toISOString()

const basinBaseURL = 'https://basin.gdr.nrcan.gc.ca/wells/'
const documentPaths = [
    {
        id: 'wells', 
        path: 'index_e.php'
    }
]

const areas = []

// This is a test API for scraping data directly off the BASIN database

// Should adjust to do this daily
axios.get('https://basin.gdr.nrcan.gc.ca/wells/index_e.php')
    .then(response => {
        const html = response.data
        const $ = cheerio.load(html)

        // Get all available areas
        $('select[name=area] option', html).each(function() {
            const area = $(this).text();
            areas.push(area)
        })
    }).catch(err => console.log(err))

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

app.get('/wells', (req, res) => {
    try {
        const path = documentPaths.filter(document => document.id === 'wells')[0].path
        const URL = basinBaseURL + path

        axios.get(URL)
            .then(response => {
                const html = response.data
                const $ = cheerio.load(html)

                const areas = []
                const wells = []

                // Get all available areas
                const a = $('select[name=area] option', html).each(function() {
                    const area = $(this).text();
                    areas.push(area)
                })

                // Get all available wells
                const b = $("select[name='wellid_select[]'] option", html) // Gets all available well options

                console.log(a.length)
                console.log(b.length)
                // each(function() {
                //     console.log($(this).text())
                // })
                res.json({html})
            }).catch(err => console.log(err))

    } catch (err) {
        console.log(err)
    }

})

app.listen(PORT, () => console.log('SERVER RUNNING ON PORT ', PORT))