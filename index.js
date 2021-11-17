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
            areas.push(area.split(' ').join('%20')) // Changes spaces to URL space characters
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

app.get('/wells', async (req, res) => {
    try {
        const path = documentPaths.filter(document => document.id === 'wells')[0].path
        // const URL = basinBaseURL + path
        let baseURL = 'https://basin.gdr.nrcan.gc.ca/wells/query.php?level=1&areas='

        // build the url using available areas
        baseURL += areas.join('_')

        const wells = []

        await axios.get(baseURL)
            .then(response => {
                const html = response.data
                // Doing some string magic here
                const data = html.split('WELL(S) RETURNED **\");')[1]
                // res.json(data.split(";"))
                data.split(";").forEach(d => {
                    try {
                        const trimStart = d.split("myNewOption(")[1]
                        const trimEnd = trimStart.split(",")[0]
                        const removeBackslash = trimEnd.split('\\').join('')
                        const removeDblQuotes = removeBackslash.split('"').join('')

                        wells.push(removeDblQuotes)
                    } catch (err) {console.log(err)}
                })
            }).catch(err => console.log(err))

            console.log(wells)

        let wellURL = 'https://basin.gdr.nrcan.gc.ca/wells/well_query_e.php?well=' + wells[0]
        // wells.forEach(well => 
        //     wellURL += 'well=' + well + '&')
        //     console.log(wellURL)
            
            // console.log(wellURL)
        await axios.get(wellURL)
            .then(response => {
                res.json(response.data)
            })

    } catch (err) {
        console.log(err)
    }

})

app.listen(PORT, () => console.log('SERVER RUNNING ON PORT ', PORT))