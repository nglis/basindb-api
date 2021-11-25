// Require libraries
const axios = require('axios')
const cheerio = require('cheerio')

// Load config
const config = require('../config/config')

module.exports.loadData = function () {
    const areas = []
    axios.get(config.BASIN_INDEX_URL)
    .then(response => {
        const html = response.data
        const $ = cheerio.load(html)

        // Get all available areas
        $('select[name=area] option', html).each(function() {
            const area = $(this).text();
            areas.push(area.split(' ').join('%20')) // Changes spaces to URL space characters
        })

        console.log("LOADED ALL AVAILABLE AREAS")
        return areas;
    }).catch(err => console.log(err))

}
