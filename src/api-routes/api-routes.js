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

    // Returns basic data for one well by GSC (shorthand well identifier)
    app.get('/well/:gsc', async (req, res) => {
        
        try {
            const wellGSC = req.params.gsc;
            const well = services.getWellByGSC(wellGSC, data.wellData)

            if (well) res.json(well)
            res.status(404).send(
                {
                    error: "GSC not found (GSC's are not case sensitive). To find a list of GSC's and other basic well data, use the /all endpoint.",
                    code: 404
                }
            )
        } catch (err) {
            console.log(err)
        }
    })
}
