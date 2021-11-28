const services = require('../services/services')

module.exports = function(app, data) {
    // Returns json with details of last date updated
    app.get('/info', (req, res) => {
        try {
            res.json(
                {
                    lastUpdated: data.lastUpdated,
                    info: 'Thank you for using the BASIN DB API.'
                }
            )
        } catch (err) {
            console.log(err)
        }
    })

    // Returns all available well data
    app.get('/all', async (req, res) => {
        try {
            res.json(data.wellData)
        } catch (err) {
            console.log(err)
        }
    })

    // Returns list of well names
    app.get('/wellnames', async (req, res) => {
        try {
            const wellNames = services.getWellNames(data.wellData)
            res.json(wellNames)
        } catch (err) {
            console.log(err)
        }
    })
}