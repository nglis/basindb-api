// Require libraries
const axios = require('axios')
const cheerio = require('cheerio')

// Load config
const config = require('../config/config')

// Populates wellData with data from website
module.exports.loadData = async function () {
    // Loads list of selectable areas
    const areas = await axios.get(config.BASIN_INDEX_URL)
        .then(response => {
            const html = response.data
            const areas = getAreasFromHTML(html)

            console.log("LOADED ALL AVAILABLE AREAS")
            return areas;
        }).catch(err => console.log(err))
    
    const areaQueryURL = config.BASIN_AREA_QUERY_URL + areas.join('_')

    // Loads list of selectable wells based on selected areas
    const wells = await axios.get(areaQueryURL)
        .then(response => {
            const html = response.data
            const wells = getWellsFromHTML(html)

            console.log("LOADED ALL AVAILABLE WELLS")
            return wells;
        }).catch(err => console.log(err))

    // The maximum URL length limits the amounts of wells we can query so we split them into groups
    const wellGroups = splitWellsIntoGroups(wells);

    const pages = []
    
    for (const groupIdx in wellGroups) {
        let wellURL = 'https://basin.gdr.nrcan.gc.ca/wells/well_query_e.php?'
        wellGroups[groupIdx].forEach(well => {
            wellURL += 'wellid_select[]=' + well + '&'
        })
        
        await axios.get(wellURL)
        .then(response => {
            console.log(`LOADED DATA FOR PAGE ${Number(groupIdx) + 1} OF ${wellGroups.length}`)
            pages.push(response.data)
        })
    }

    const wellData = getWellDataFromPages(pages);
    console.log(`DATA LOADING COMPLETED (${wells.length} wells)`)

    return wellData;
}

function getAreasFromHTML(html) {
    if (!html) return []

    const areas = []
    const $ = cheerio.load(html)

    // Gets line from select option and pulls area name
    $('select[name=area] option', html).each(function() {
        const area = $(this).text();
        areas.push(area.split(' ').join('%20')) 
    })

    return areas;
}

function getWellsFromHTML(html) {
    if (!html) return []

    const wells = []

    const data = html.split('WELL(S) RETURNED **\");')[1]
    data.split(";").forEach(d => {
        if (!d || !d.includes("myNewOption")) return;

        const trimStart = d.split("myNewOption(")[1]
        const trimEnd = trimStart.split(",")[0]
        const removeBackslash = trimEnd.split('\\').join('')
        const removeDblQuotes = removeBackslash.split('"').join('')

        wells.push(removeDblQuotes)
    });

    return wells
}

function splitWellsIntoGroups(wells) {
    const wellGroups = []
    const maxWellsPerGroup = 300

    for (let i = 0; i < wells.length; i++) {
        const groupIndex = i / maxWellsPerGroup + 1;
        if (groupIndex > wellGroups.length) {
            wellGroups.push([]);
        }

        // Push well to last group
        wellGroups[wellGroups.length - 1].push(wells[i])
    }

    return wellGroups;
}

function getWellDataFromPages(pages) {
    // Need to clean this up
    let wellData = []

    pages.forEach(page => {
        const wellDataForPage = getWellDataFromPage(page)
        wellData = [...wellData, ...wellDataForPage]
    });

    return wellData;
}

function getWellDataFromPage(page) {
    const wellData = []
    const $ = cheerio.load(page)

    $('.querytableborder tbody tr', page)
        .each(function() {
            let row = $(this).first().text()
            row = row.split('\t').join()
            row = row.split('\n\n').join('^')
            row = row.split(',').join('')
            let columns = row.split("^")
            columns = columns.map(col => col.trim())

            const wellObj = createWellObject(columns)
            wellData.push(wellObj);
    })

    // Remove table header from data
    wellData.shift()

    return wellData
}

function createWellObject(columnData) {
    const wellObject = {}

    // Index starts at 1, first index is empty
    for (let i = 1; i < columnData.length; i++) {
        // Only return defined columns
        if (i > config.WELL_COLUMNS.length) break;

        const columnName = config.WELL_COLUMNS[i]
        wellObject[columnName] = columnData[i]
    }

    return wellObject
} 

