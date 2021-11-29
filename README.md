This API can be used to access currently available well data that exists in Natural Resources Canada's BASIN database.

For details about the BASIN database please visit: https://basin.gdr.nrcan.gc.ca/index_e.php

The current version of the API fetches basic well data including (but not limited to):

- Well Name
- GSC # (shorthand identifier)
- Unique Well ID
- Original Spud Year
- Operator
- Area
- Basin
- Status

Sample endpoints

/wells - gets all available basic well data
/wellnames - gets list of available well names
/areas - gets list of areas for available wells
/basins - gets list of basins for available wells

/well/[gscID] - gets basic well data by GSC

/wells/area/[area] - gets all wells for specific area
/wells/basin/[basin] - gets all wells for available basin
/wells/status/[status] - get all wells by status