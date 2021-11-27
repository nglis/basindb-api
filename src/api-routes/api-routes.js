module.exports = function(app, dataRows) {
    app.get('/info', (req, res) => {
        try {
            res.json(
                {
                    lastRelease: '',
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
}