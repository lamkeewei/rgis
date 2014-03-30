import shapefile
import json
import urllib
import requests

def shapefileToGeoJSON(filename, projection):
    reader = shapefile.Reader(filename)
    fields = reader.fields[1:]
    field_names = [field[0] for field in fields]
    buffer = []
    for sr in reader.shapeRecords():
       atr = dict(zip(field_names, sr.record))
       geom = sr.shape.__geo_interface__
       buffer.append(dict(type="Feature", \
        geometry=geom, properties=atr))

    if projection == "unknown":
        try:
            prjFile = open(filename+".prj")

            prjContents = prjFile.readlines()

            prjFile.close()

        except IOError:
            return("projection not known")

        prjString = ""

        for line in prjContents:
            prjString = prjString + line

        f = {'terms': prjString}
        prjString = urllib.urlencode(f)

        # now put it as a query string to get the epsg code
        epsg_r = requests.get("http://prj2epsg.org/search.json?mode=wkt&" + prjString)
        epsg_r = epsg_r.json()['codes']

        epsgCode = epsg_r[0]['code']

    else:
        epsgCode = projection # user specified a projection

    # write the GeoJSON

    outputGeoJSON = {"type": "FeatureCollection",\
    "crs": { "type": "link", "properties": {
          "href": "http://spatialreference.org/ref/epsg/" + epsgCode + "/proj4/",\
          "type": "proj4"\
          }\
        },\
    "features": buffer}

    return(outputGeoJSON)