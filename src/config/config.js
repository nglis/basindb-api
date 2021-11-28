const config = {
    "PORT": process.env.PORT || 8000,
    "BASIN_CERT_LOC": __dirname + '../../../ssl/basin_cert.pem',
    "ENTRUST_CERT_LOC": __dirname + '../../../ssl/entrust_cert.pem',
    "ENTRUST_ROOT_LOC": __dirname + '../../../ssl/entrust_root.pem',
    "BASIN_INDEX_URL": 'https://basin.gdr.nrcan.gc.ca/wells/index_e.php',
    "BASIN_AREA_QUERY_URL": 'https://basin.gdr.nrcan.gc.ca/wells/query.php?level=1&areas=',
    "WELL_COLUMNS": ["NAME", "GSC", "ID", "SPUD_YEAR", "OPERATOR", "AREA", "BASIN", "STATUS"]
}

module.exports = config