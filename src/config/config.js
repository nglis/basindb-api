const config = {
    "PORT": process.env.PORT || 8000,
    "BASIN_CERT_LOC": __dirname + '../../../ssl/basin_cert.pem',
    "ENTRUST_CERT_LOC": __dirname + '../../../ssl/entrust_cert.pem',
    "ENTRUST_ROOT_LOC": __dirname + '../../../ssl/entrust_root.pem',
    "BASIN_INDEX_URL": 'https://basin.gdr.nrcan.gc.ca/wells/index_e.php',
    "BASIN_AREA_QUERY_URL": 'https://basin.gdr.nrcan.gc.ca/wells/query.php?level=1&areas=',
    "BASIN_WELL_QUERY_URL": "https://basin.gdr.nrcan.gc.ca/wells/well_query_e.php?",
    "BASIN_WELL_LOCATION_QUERY_URL": "https://basin.gdr.nrcan.gc.ca/wells/location_e.php?",
    "WELL_COLUMNS": ["NAME", "GSC", "ID", "SPUD_YEAR", "OPERATOR", "AREA", "BASIN", "STATUS"],

    // Other data URL's
    "WELL_PRODUCTION_URL": "https://basin.gdr.nrcan.gc.ca/wells/single_production_e.php?well=",
    "WELL_RIGINFO_URL" : "https://basin.gdr.nrcan.gc.ca/wells/single_riginfo_e.php?well=",
    "WELL_TESTING_URL": "https://basin.gdr.nrcan.gc.ca/wells/single_testing_e.php?well=",
    "WELL_REPORTS_URL": "https://basin.gdr.nrcan.gc.ca/wells/single_reports_e.php?well=",
    "WELL_ELOGS_URL": "https://basin.gdr.nrcan.gc.ca/wells/single_elogs_e.php?well=",
    "WELL_COMMENTS_URL": "https://basin.gdr.nrcan.gc.ca/wells/single_samples_e.php?well=",
    "WELL_PRESSURE_URL": "https://basin.gdr.nrcan.gc.ca/wells/single_pressure_e.php?well=",
    "WELL_TEMPERATURE_URL": "https://basin.gdr.nrcan.gc.ca/wells/single_temperature_e.php?well=",
    "WELL_MATURITY_URL": "https://basin.gdr.nrcan.gc.ca/wells/single_maturation_e.php?well=",
    "WELL_LITHOSTRAT_URL": "https://basin.gdr.nrcan.gc.ca/wells/single_lithostrat_e.php?type=picks&well=",
    "WELL_BIOSTRAT_URL": "https://basin.gdr.nrcan.gc.ca/wells/single_biostrat_e.php?well="

}

module.exports = config