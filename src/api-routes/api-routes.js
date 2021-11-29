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

    // Returns basic data for all wells
    app.get('/wells', async (req, res) => {
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

    // Returns list of well areas
    app.get('/areas', async (req, res) => {
        try {
            const wellAreas = services.getWellAreas(data.wellData)
            res.json(wellAreas)
        } catch (err) {
            console.log(err)
        }
    })
    
    // Returns list of well basins
    app.get('/basins', async (req, res) => {
        try {
            const wellBasins = services.getWellBasins(data.wellData)
            res.json(wellBasins)
        } catch (err) {
            console.log(err)
        }
    })
    
    // Returns list of well operators
    app.get('/operators', async (req, res) => {
        try {
            const wellOperators = services.getWellOperators(data.wellData)
            res.json(wellOperators)
        } catch (err) {
            console.log(err)
        }
    })
    
    // Returns list of well statuses
    app.get('/statuses', async (req, res) => {
        try {
            const wellStatuses = services.getWellStatuses(data.wellData)
            res.json(wellStatuses)
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
            else res.status(404).send(
                {
                    error: "GSC not found (GSC's are not case sensitive). To find a list of GSCs and other basic well data, use the /wells endpoint.",
                    code: 404
                }
            )
        } catch (err) {
            console.log(err)
        }
    })

    // Returns basic data for wells by area
    app.get('/wells/area/:area', async (req, res) => {
    
        try {
            const area = req.params.area;
            const wells = services.getWellsByArea(area, data.wellData)

            if (wells && wells.length > 0) res.json(wells)
            else res.status(404).send(
                {
                    error: "Area not found. If area name has spaces, try replacing them with %20. To find a list of areas or other basic well data, use the /areas or /wells endpoints.",
                    code: 404
                }
            )
        } catch (err) {
            console.log(err)
        }
    })

    // Returns basic data for wells by basin
    app.get('/wells/basin/:basin', async (req, res) => {
    
        try {
            const basin = req.params.basin;
            const wells = services.getWellsByBasin(basin, data.wellData)

            if (wells && wells.length > 0) res.json(wells)
            else res.status(404).send(
                {
                    error: "Basin not found. If basin name has spaces, try replacing them with %20. To find a list of basins or other basic well data, use the /basins or /wells endpoints.",
                    code: 404
                }
            )
        } catch (err) {
            console.log(err)
        }
    })

    
    // Returns basic data for wells by status
    app.get('/wells/status/:status', async (req, res) => {
    
        try {
            const status = req.params.status;
            const wells = services.getWellsByStatus(status, data.wellData)

            if (wells && wells.length > 0) res.json(wells)
            else res.status(404).send(
                {
                    error: "Status not found. If status has spaces, try replacing them with %20. To find a list of basins or other basic well data, use the /statuses or /wells endpoints.",
                    code: 404
                }
            )
        } catch (err) {
            console.log(err)
        }
    })
}
