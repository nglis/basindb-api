const config = {
    "PORT": process.env.PORT || 8000,
    "BASIN_CERT_LOC": __dirname + '../../../ssl/basin_cert.pem',
    "ENTRUST_CERT_LOC": __dirname + '../../../ssl/entrust_cert.pem',
    "ENTRUST_ROOT_LOC": __dirname + '../../../ssl/entrust_root.pem',
    "BASIN_INDEX_URL": 'https://basin.gdr.nrcan.gc.ca/wells/index_e.php'
}

module.exports = config