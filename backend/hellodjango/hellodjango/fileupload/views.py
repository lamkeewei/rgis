from django.shortcuts import render, render_to_response
from django.http import HttpResponse, HttpResponseRedirect
from django.template import RequestContext, Template
from django.core.urlresolvers import reverse

from hellodjango import settings

from hellodjango.fileupload.models import Plugin, Shapefile
from hellodjango.fileupload.forms import *
from hellodjango.fileupload.utility import shapefileToGeoJSON

from zipreader import fileiterator

import zipfile
import requests
import json
import pyRserve

import time
import pipes
import commands
import requests
import urllib
import shutil
import math

# Create your views here.
def plugin_upload_form(request):

    # handle file upload
    if request.method == "POST":
        form = UploadForm(request.POST, request.FILES)
        if form.is_valid():

            data = form.cleaned_data

            newPlugin = Plugin(rscript = request.FILES['upload_file'], name=data['name'])
            newPlugin.save()

            # read the uploaded file to get the function name
            try:
                with open (newPlugin.get_full_path(), "rb") as rscriptfile:
                    functionContent = rscriptfile.read()
                    functionname = functionContent[:functionContent.index("<-")]

                if functionname.index(" ") != 1:
                    return HttpResponse(json.dumps({"status":"error","message": "function name is invalid"}))

            except:
                return HttpResponse(json.dumps({"status":"error","message": "unable to read file or file does not contain function name"}))

            # save the function name
            newPlugin.function_name = functionname.strip(' ')
            newPlugin.save()

            # Redirect to the document list after POST
            return HttpResponseRedirect(reverse('plugin_upload_form'))
    else:
        form = UploadForm() # an empty, unbound form

    # load all plugins for the list page
    plugins = Plugin.objects.all()

    # render list page with the plugins and the form
    return render_to_response(
        'plugin_upload_form.html',
        {'plugins': plugins, 'form': form},
        context_instance=RequestContext(request)
    )

def shapefile_upload(request):

    # handle file upload
    if request.method == "POST":
        form = ShapefileUploadsForm(request.POST, request.FILES)
        if form.is_valid():

            data = form.cleaned_data

            window_zip_file = Shapefile(zipfile = request.FILES['shapefile'], name=data['name'])
            window_zip_file.save()

            # now unzip the file
            original_zipfile = open(settings.MEDIA_ROOT+window_zip_file.zipfile.name, 'rb')
            windowzipfile = zipfile.ZipFile(original_zipfile)

            # gets the name of the files in the zip
            realfilename = windowzipfile.namelist()[0][:-4]

            windowzipfile.extractall(settings.MEDIA_ROOT+"shapefile/"+data['name'])
            original_zipfile.close()

            # save the real file name
            window_zip_file.filename = realfilename
            window_zip_file.save()

            # try to get the input epsg code
            if data['projection'] == "" or data['projection'] == None:
                filename = window_zip_file.get_full_path() + ".prj"
                try:
                    prjFile = open(filename)

                    prjContents = prjFile.readlines()

                    prjFile.close()

                except IOError:
                    return(json.dumps({"status":"error", "message":"projection not known"}))

                prjString = ""

                for line in prjContents:
                    prjString = prjString + line

                f = {'terms': prjString}
                prjString = urllib.urlencode(f)

                # now put it as a query string to get the epsg code
                epsg_r = requests.get("http://prj2epsg.org/search.json?mode=wkt&" + prjString)
                epsg_r = epsg_r.json()['codes']

                epsgCode = "EPSG:" + epsg_r[0]['code']

            else:
                epsgCode = data['projection'] # user specified a projection

            # convert to geojson
            source_filename = pipes.quote(window_zip_file.get_full_path() + ".shp")
            output_filename = pipes.quote(window_zip_file.get_full_path() + ".geojson")
            print commands.getoutput("ogr2ogr -f GeoJSON -s_srs " + epsgCode + " -t_srs EPSG:4326 " + output_filename + " " + source_filename)

            # change projection
            output_filename = pipes.quote(window_zip_file.get_full_path() + "projected.shp")
            print commands.getoutput("ogr2ogr -f \"ESRI Shapefile\" -s_srs " + epsgCode + " -t_srs EPSG:4326 " + output_filename + " " + source_filename)

            # output the geojson
            with open (window_zip_file.get_full_path() + ".geojson", "rb") as geojsonfile:
                outputgeojson = geojsonfile.read().replace('\n', '')

            # This bit of code adds the CSRF bits to your request.
            c = RequestContext(request,{"result":outputgeojson})
            t = Template("{% autoescape off %}{{result}}{% endautoescape %}") # A dummy template
            response = HttpResponse(t.render(c), content_type = 'application/json')

            response["Access-Control-Allow-Origin"] = "*"
            response["Access-Control-Allow-Methods"] = "POST, GET, OPTIONS"
            response["Access-Control-Max-Age"] = "1000"
            response["Access-Control-Allow-Headers"] = "*"

            return(response)
            # Redirect to the document list after POST
            #return HttpResponseRedirect(reverse('shapefile_upload'))

    else:
        form = ShapefileUploadsForm() # an empty, unbound form

    # load all shapefiles for the list page
    shapefiles = Shapefile.objects.all()

    # render list page with the plugins and the form
    return render_to_response(
        'shapefile_upload_form.html',
        {'shapefiles': shapefiles, 'form': form},
        context_instance=RequestContext(request)
    )

def kfunction_initialize(request):
    start = time.time()
    print time.time() - start
    print "started\n"
    if request.method == "POST":
        form = KfunctionInitializeForm(request.POST, request.FILES)

        if form.is_valid():

            data = form.cleaned_data

            point_filename = data['point']
            window_filename = data['window']

            # get the relevant files
            point_object = Shapefile.objects.get(name=point_filename)
            window_object = Shapefile.objects.get(name=window_filename)

            # get the jsons

            conn = pyRserve.connect()

            # read the shapefile
            window_filename = window_object.get_full_path()
            point_filename = point_object.get_full_path()

            # retrieve and parse the jsons
            with open(window_filename+".geojson") as windowfile:
                windowJson = windowfile.read().replace('\n', '')

            with open(point_filename+".geojson") as pointfile:
                pointJson = pointfile.read().replace('\n', '')

            print time.time() - start
            print "got the jsons\n"

            # load the function
            functionFile = open(settings.BASE_DIR + '/fileupload/lfunction.r')
            functionContent = functionFile.read()

            conn.voidEval(functionContent)
            print window_filename
            print point_filename
            print time.time() - start
            print "function starting\n"

            resultsJson = conn.r.func0(window_filename+"projected", point_filename+"projected")
            print time.time() - start
            print "results retrieved\n"
            # format the graph output (currently its 4 list of y values. need X lists of y1, y2, y3, y4 values)
            resultsJson = json.loads(resultsJson)
            newResultsJson = []

            try:
                for i in range(0, len(resultsJson['r'])):
                    newObj = {"r": resultsJson['r'][i], "obs":resultsJson['obs'][i], "hi":resultsJson['hi'][i], "lo":resultsJson['lo'][i]}
                    newResultsJson.append(newObj)

            except:
                message = "error running l-function in r"
                return HttpResponse(json.dumps({"status":"error", "message":message}), content_type="application/json")

            response = {}
            response['status'] = 'success'
            response['type'] = 'graph'
            response['graph'] = newResultsJson
            response['window'] = json.loads(windowJson)
            response['point'] = json.loads(pointJson)

            response = json.dumps(response, indent=2)

            finalresponse = HttpResponse(response, content_type="application/json")

            finalresponse["Access-Control-Allow-Origin"] = "*"
            finalresponse["Access-Control-Allow-Methods"] = "POST, GET, OPTIONS"
            finalresponse["Access-Control-Max-Age"] = "1000"
            finalresponse["Access-Control-Allow-Headers"] = "*"

            return finalresponse

    else:
        form = KfunctionInitializeForm() # an empty, unbound form

        return render_to_response(
            'kfunction_form.html',
            {'form': form},
            context_instance=RequestContext(request)
        )

def kde_function(request):

    if request.method == "POST":
        form = KfunctionKDEInitializeForm(request.POST, request.FILES)

        if form.is_valid():

            data = form.cleaned_data

            point_filename = data['point']
            window_filename = data['window']
            bandwidth = float(data['bandwidth'])

            # get the relevant files
            point_object = Shapefile.objects.get(name=point_filename)
            window_object = Shapefile.objects.get(name=window_filename)

            conn = pyRserve.connect()

            # read the shapefile
            window_filename = window_object.get_full_path() + "projected"
            point_filename = point_object.get_full_path() + "projected"
            print window_filename

            # load the function
            functionFile = open(settings.BASE_DIR + '/fileupload/kdefunction.r')
            functionContent = functionFile.read()

            conn.voidEval(functionContent)

            resultsJson = conn.r.KDE_function(window_filename, point_filename, bandwidth)

            # print json.dumps(resultsJson, indent=2)
            intensity = resultsJson['kde_matrix']
            yrow = resultsJson['yrow']
            xcol = resultsJson['xcol']

            newResultsJson = []

            try:
                for i in range(0, len(intensity)):
                    for j in range(0, len(intensity[0])):
                        if not math.isnan(float(intensity[i][j])):
                            lat = yrow[j]
                            lng = xcol[i]
                            intensity1 = intensity[i][j]
                            newResultsJson.append([lat, lng, intensity1])

            except:
                message = "error running kde function in r"
                return HttpResponse(json.dumps({"status":"error", "message":message}), content_type="application/json")

            response = {}
            response['status'] = 'success'
            response['namespace'] = newResultsJson

            response = json.dumps(response, indent=2)

            finalresponse = HttpResponse(response, content_type="application/json")

            finalresponse["Access-Control-Allow-Origin"] = "*"
            finalresponse["Access-Control-Allow-Methods"] = "POST, GET, OPTIONS"
            finalresponse["Access-Control-Max-Age"] = "1000"
            finalresponse["Access-Control-Allow-Headers"] = "*"

            return finalresponse

    else:
        form = KfunctionKDEInitializeForm() # an empty, unbound form

        return render_to_response(
            'kfunction_kde.html',
            {'form': form},
            context_instance=RequestContext(request)
        )

