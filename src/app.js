const PORT = process.env.PORT || 8000

var rootCas = require('ssl-root-cas').create();
 
rootCas
    .addFile(__dirname + '../ssl/basin_cert.pem')
    .addFile(__dirname + '../ssl/entrust_cert.pem')
    .addFile(__dirname + '../ssl/entrust_root.pem');

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
        console.log("DATA LOADING COMPLETED")
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
                        // console.log(d)
                        const trimStart = d.split("myNewOption(")[1]
                        const trimEnd = trimStart.split(",")[0]
                        const removeBackslash = trimEnd.split('\\').join('')
                        const removeDblQuotes = removeBackslash.split('"').join('')

                        wells.push(removeDblQuotes)
                    } catch (err) {return;}
                })
            }).catch(err => console.log(err))

        // The maximum URL length limits the amounts of wells we can get at once
        // Split the wells into groups of 300

        const wellGroups = []
        const maxWellsPerGroup = 300

        let wellIndex = 0
        let groupIndex = 1

        while (wellIndex < wells.length) {
            if (groupIndex > wellGroups.length) {
                wellGroups.push([]) // adds a new list to well groups
            }

            const currentGroup = wellGroups[wellGroups.length - 1] // gets last well group
            currentGroup.push(wells[wellIndex])

            if (currentGroup.length === maxWellsPerGroup) {
                groupIndex ++
            }

            wellIndex++
        }

        const pages = []
        const startTime = Date.now()
        console.log("Generating well groups")
        for (const wellGroup of wellGroups) {
            // console.log(wellGroup)
            let wellURL = 'https://basin.gdr.nrcan.gc.ca/wells/well_query_e.php?'
            wellGroup.forEach(well => {
                wellURL += 'wellid_select[]=' + well + '&'
            })
            
            await axios.get(wellURL)
            .then(response => {
                pages.push(response.data)
            })
        }
        const endTime = Date.now()
        console.log(`Done generating groups in ${(endTime - startTime)/1000}s`)

        const dataRows = []

        console.log("Extracting data from pages")

        pages.forEach(page => {
            const $ = cheerio.load(page);
            $('.querytableborder tbody tr', page)
                .each(function() {
                    let row = $(this).first().text()
                    row = row.split('\t').join()
                    row = row.split('\n\n').join('^')
                    row = row.split(',').join('')
                    let columns = row.split("^")
                    columns = columns.map(col => col.trim())
                    dataRows.push(columns);
            })
        })
        const rowEndTime = Date.now()
        console.log(`Done extracting data from pages in ${(rowEndTime - endTime)/1000}s`)
        res.json({dataRows})

    } catch (err) {
        console.log(err)
    }

})

app.listen(PORT, () => console.log('SERVER RUNNING ON PORT ', PORT))