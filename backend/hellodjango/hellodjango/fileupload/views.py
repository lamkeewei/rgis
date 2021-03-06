from django.shortcuts import render, render_to_response
from django.http import HttpResponse, HttpResponseRedirect
from django.template import RequestContext, Template
from django.core.urlresolvers import reverse
from django.views.decorators.csrf import csrf_exempt

from hellodjango import settings

from hellodjango.fileupload.models import Plugin, Shapefile, User
from hellodjango.fileupload.forms import *
from hellodjango.fileupload.utility import shapefileToGeoJSON

from zipreader import fileiterator

import os
import shutil
import zipfile
import requests
import json
import pyRserve

import time
import pipes
import commands
import subprocess
import requests
import urllib
import shutil
import math
import uuid

def initialize_app(request):
    Shapefile.objects.all().delete()

    shapefilesLoc = os.path.join(settings.MEDIA_ROOT, 'shapefile');

    if os.path.exists(shapefilesLoc):
        shutil.rmtree(shapefilesLoc)

    os.mkdir(shapefilesLoc)
    return HttpResponse()


def get_csrftoken(request):
    # This bit of code adds the CSRF bits to your request.
    c = RequestContext(request)
    t = Template("{% csrf_token %}") # A dummy template
    response = HttpResponse(t.render(c), content_type = 'application/json')
    return response

# Create your views here.
#@csrf_exempt
def plugin_upload_form(request):

    # handle file upload
    if request.method == "POST":

        data = json.loads(request.body)

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

@csrf_exempt
def user_files(request):

    if request.method == "POST":

        data = json.loads(request.body)

        if not 'username' in data:
            return HttpResponse(json.dumps({"status":"error","message": "username not provided"}))

        username = data['username']

        user, created = User.objects.get_or_create(name=username)

        if created:
            user.save()
            return HttpResponse(json.dumps({"status":"success"}))

        else:
            files = Shapefile.objects.filter(user=user)

        filelist = []
        for shapefile in files:
            filelist.append(shapefile.name)

        return HttpResponse(json.dumps({"status":"success","files": filelist}))

@csrf_exempt
def shapefile_upload(request):

    # handle file upload
    if request.method == "POST":

        if not request.FILES or 'shapefile' not in request.FILES:
            return HttpResponse(json.dumps({"status":"error", "message":"shapefile not specified"}))

        if 'name' not in request.POST:
            return HttpResponse(json.dumps({"status":"error", "message":"name not specified"}))

        if 'username' not in request.POST:
            return HttpResponse(json.dumps({"status":"error", "message":"username not specified"}))

        # check that the user exists
        try:
            user = User.objects.get(name=request.POST['username'])

        except User.DoesNotExist:
            return HttpResponse(json.dumps({"status":"error", "message":"user does not exist"}))

        name = request.POST["name"]

        # check that this user doesnt already have a file of this name
        files = Shapefile.objects.filter(user=user, name=name)

        if not len(files) == 0:
            return HttpResponse(json.dumps({"status":"error", "message":"user already has a file of this name"}))

        window_zip_file = Shapefile(zipfile = request.FILES['shapefile'], name=request.POST['name'], user=user)
        window_zip_file.save()

        # check the extension
        extension = window_zip_file.zipfile.name.split('.')[-1].lower()

        if extension == "zip":

            # now unzip the file
            original_zipfile = open(os.path.join(settings.MEDIA_ROOT, window_zip_file.zipfile.name), 'rb')
            windowzipfile = zipfile.ZipFile(original_zipfile)

            # gets the name of the files in the zip
            realfilename = windowzipfile.namelist()[0][:-4]

            windowzipfile.extractall(os.path.join(settings.MEDIA_ROOT,"shapefile",request.POST['name']))

            # create a new name for the file
            realfilename2 = str(uuid.uuid4()).replace("-", "")

            # rename the files
            for filename in os.listdir(os.path.join(settings.MEDIA_ROOT,"shapefile",request.POST['name'])):
                os.rename(os.path.join(settings.MEDIA_ROOT,"shapefile",request.POST['name'],filename), os.path.join(settings.MEDIA_ROOT,"shapefile",request.POST['name'], filename.replace(realfilename, realfilename2)))

            # save the real file name
            window_zip_file.filename = realfilename2
            window_zip_file.save()

            # try to get the input epsg code
            if 'projection' not in request.POST or request.POST['projection'] == "undefined" or (request.POST['projection'] == "" or request.POST['projection'] == None):

                filename = window_zip_file.get_full_path() + ".prj"
                try:
                    prjFile = open(filename)

                    prjContents = prjFile.readlines()

                    prjFile.close()

                    prjString = ""

                    for line in prjContents:
                        prjString = prjString + line

                    f = {'terms': prjString}
                    prjString = urllib.urlencode(f)

                    # now put it as a query string to get the epsg code
                    epsg_r = requests.get("http://prj2epsg.org/search.json?mode=wkt&" + prjString)
                    epsg_r = epsg_r.json()['codes']

                    epsgCode = "EPSG:" + epsg_r[0]['code']

                except IOError:
                    # default to wgs84
                    epsgCode = "EPSG:4326"

            else:
                epsgCode = request.POST['projection'] # user specified a projection

            # convert to (projected) geojson
            source_filename = window_zip_file.get_full_path() + ".shp"
            output_filename = window_zip_file.get_full_path() + ".geojson"
            print subprocess.call(["ogr2ogr", "-f", "GeoJSON", "-s_srs", epsgCode, "-t_srs", "EPSG:4326", output_filename, source_filename])

            # change projection of shapefile
            output_filename = window_zip_file.get_full_path() + "projected.shp"
            print subprocess.call(["ogr2ogr", "-f", "ESRI Shapefile", "-s_srs", epsgCode, "-t_srs", "EPSG:4326", output_filename, source_filename])

        elif extension == "geojson":

            # create the folder
            if not os.path.exists(os.path.join(settings.MEDIA_ROOT, "shapefile", name)):
                os.makedirs(os.path.join(settings.MEDIA_ROOT, "shapefile", name))

            random_filename = str(uuid.uuid4()).replace("-", "")

            # move uploaded file to the right folder and rename with random name
            os.rename(os.path.join(settings.MEDIA_ROOT, window_zip_file.zipfile.name), os.path.join(settings.MEDIA_ROOT, "shapefile", name, random_filename + ".geojson"))

            # save these changes
            window_zip_file.filename = random_filename
            window_zip_file.save()

            # try to get the input epsg code
            if 'projection' in request.POST and request.POST['projection'] != "undefined" and request.POST['projection'] != "" and request.POST['projection'] != None:
                epsgCode = request.POST['projection']

            else:
                # default to wgs84
                epsgCode = "EPSG:4326"

            # convert to projected geojson if necessary
            if epsgCode != "EPSG:4326":
                source_filename = window_zip_file.get_full_path() + ".geojson"
                output_filename = window_zip_file.get_full_path() + "projected.geojson"

                print subprocess.call(["ogr2ogr", "-f", "GeoJSON", "-s_srs", epsgCode, "-t_srs", "EPSG:4326", output_filename, source_filename])

                # rename the original file
                os.rename(source_filename, window_zip_file.get_full_path() + "original.geojson")

                # rename the projected file
                os.rename(output_filename, window_zip_file.get_full_path() + ".geojson")

            # convert to (projected) shapefile
            source_filename = window_zip_file.get_full_path() + ".geojson"
            output_filename = window_zip_file.get_full_path() + "projected.shp"

            print subprocess.call(["ogr2ogr", "-f", "ESRI Shapefile", "-s_srs", epsgCode, "-t_srs", "EPSG:4326", output_filename, source_filename])

        # output the geojson
        with open (window_zip_file.get_full_path() + ".geojson", "rb") as geojsonfile:
            outputgeojson = geojsonfile.read().replace('\n', '')
            geojsonfile.close()

        # delete the orignal zip file and the extracted contents
        # print window_zip_file.zipfile.url

        # This bit of code adds the CSRF bits to your request.
        c = RequestContext(request,{"result":outputgeojson})
        t = Template("{% autoescape off %}{{result}}{% endautoescape %}") # A dummy template
        output_response = HttpResponse(t.render(c), content_type = 'application/json')

        output_response["Access-Control-Allow-Origin"] = "*"
        output_response["Access-Control-Allow-Methods"] = "POST, GET, OPTIONS"
        output_response["Access-Control-Max-Age"] = "1000"
        output_response["Access-Control-Allow-Headers"] = "*"

        return(output_response)
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

@csrf_exempt
def get_user_file(request):

    if request.method == "POST":

        data = json.loads(request.body)

        if not 'username' in data:
            return HttpResponse(json.dumps({"status":"error","message": "username not provided"}))

        if not 'name' in data:
            return HttpResponse(json.dumps({"status":"error","message": "file name not provided"}))

        username = data['username']

        name = data['name']

        try:
            user = User.objects.get(name=username)

        except User.DoesNotExist:
            return HttpResponse(json.dumps({"status":"error","message": "user does not exist"}))

        try:
            requested_file = Shapefile.objects.get(user=user, name=name)

        except Shapefile.DoesNotExist:
            return HttpResponse(json.dumps({"status":"error","message": "user does not have a shapefile of this name"}))

        with open (requested_file.get_full_path() + ".geojson", "rb") as geojsonfile:
            outputgeojson = geojsonfile.read().replace('\n', '')
            geojsonfile.close()

        return HttpResponse(outputgeojson, content_type="application/json")

@csrf_exempt
def kfunction_initialize(request):
    start = time.time()
    print time.time() - start
    print "started\n"

    if request.method == "POST":

        data = json.loads(request.body)

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
        ##windows path
        # functionFile = open(settings.BASE_DIR + '\\fileupload\\lfunction.r')
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
        finally:
            conn.close()
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

@csrf_exempt
def kde_function(request):

    if request.method == "POST":

        data = json.loads(request.body)

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
        # print window_filename

        # load the function
        functionFile = open(settings.BASE_DIR + '/fileupload/kdefunction.r')
        ##windows path
        # functionFile = open(settings.BASE_DIR + '\\fileupload\\kdefunction.r')
        print functionFile
        functionContent = functionFile.read()

        conn.voidEval(functionContent)

        # output_path = settings.BASE_DIR + '/kdeoutputs/'
        ##windows path
        output_path = os.path.join(settings.BASE_DIR,'kdeoutputs')
        output_name = str(uuid.uuid4()).replace("-", "")

        print output_path
        print output_name

        try:
            # note that KDE function only returns the status
            # it creates the shapefile of contour lines
            resultsJson = conn.r.KDE_function(window_filename, point_filename, bandwidth, output_path, output_name)

            # convert to geojson
            source_filename = os.path.join(output_path, output_name + ".shp")
            output_filename = os.path.join(output_path, output_name + ".geojson")
            print subprocess.call("ogr2ogr -f GeoJSON -s_srs EPSG:4326 -t_srs EPSG:4326 " + output_filename + " " + source_filename)

            # output the geojson
            with open (os.path.join(output_path,output_name + ".geojson"), "rb") as geojsonfile:
                outputgeojson = json.loads(geojsonfile.read().replace('\n', ''))
                geojsonfile.close()

        except:
            message = "error running kde function in r"
            return HttpResponse(json.dumps({"status":"error", "message":message}), content_type="application/json")
        finally:
            conn.close()

        response = json.dumps(outputgeojson, indent=2)

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

@csrf_exempt
def gwr_initialize(request):

    if request.method == "POST":

        data = json.loads(request.body)

        shapefile_filename = data['namespace']

        shapefile_object = Shapefile.objects.get(name=shapefile_filename)

        conn = pyRserve.connect()

        # get the path to shapefile
        shapefile_filename = shapefile_object.get_full_path() + "projected"

        # load the function
        functionFile = open(settings.BASE_DIR + '/fileupload/new.r')
        ##windows path
        # functionFile = open(settings.BASE_DIR + '\\fileupload\\new.r')
        functionContent = functionFile.read()

        conn.voidEval(functionContent)

        try:
            # get the list of columns in this shapefile
            nameslist = conn.r.getshpheader(shapefile_filename)

            nameslist = list(nameslist)

        except:
            message = "error running function in r"
            return HttpResponse(json.dumps({"status":"error", "message":message}), content_type="application/json")

        finally:
            conn.close()

        response_obj = {}
        response_obj['status'] = "success"
        response_obj['variables'] = nameslist

        return HttpResponse(json.dumps(response_obj), content_type="application/json")

    else:
        form = GWRInitializeForm() # an empty, unbound form

        return render_to_response(
            'gwr_initialize_form.html',
            {'form': form},
            context_instance=RequestContext(request)
        )

@csrf_exempt
def gwr_plot(request):

    if request.method == "POST":

        data = json.loads(request.body)

        shapefile_filename = data['namespace']
        dependent = data['dependent']
        independent = data['independent']

        # get the filepath to this shapefile
        shapefile_object = Shapefile.objects.get(name=shapefile_filename)

        # get the path to shapefile
        shapefile_file = shapefile_object.get_full_path() + "projected"

        # based on the dependent and independent variables, prepare the formula
        prepared_formula = dependent + " ~ "

        for variable in independent:
            prepared_formula = prepared_formula + variable + " + "

        # remove the last +
        prepared_formula = prepared_formula[:-3]

        # get a connection to rserve
        conn = pyRserve.connect()

        # prepare the r function
        functionFile = open(settings.BASE_DIR + '/fileupload/plotGWR.r')
        ##windows path
        # functionFile = open(settings.BASE_DIR + '\\fileupload\\plotGWR.r')
        functionContent = functionFile.read()

        conn.voidEval(functionContent)

        # set the file path for the output shapefile
        output_path = os.path.join(settings.BASE_DIR, 'gwroutputs')
        ##windows path
        # output_path = settings.BASE_DIR + '\\gwroutputs\\'
        output_name = shapefile_filename + str(uuid.uuid4()).replace("-", "")[:10]

        try:
            # get the statistics of this particular input
            # this function will also create a shapefile
            function_output = conn.r.gwr_function(shapefile_file, prepared_formula, output_path, output_name)
            # print 'variables'
            # print list(function_output['variables'])
            # print 'significance'
            # print function_output['significance']
            # print 'variance_inflation_factors'
            # print function_output['variance_inflation_factors']
            variables = list(function_output)

        except:
            message = "error running function in r"
            return HttpResponse(json.dumps({"status":"error", "message":message}), content_type="application/json")
        finally:
            conn.close();

        # convert to geojson
        source_filename = os.path.join(output_path, output_name + ".shp")
        output_filename = os.path.join(output_path, output_name + ".geojson")
        print subprocess.call("ogr2ogr -f GeoJSON -s_srs EPSG:4326 -t_srs EPSG:4326 " + output_filename + " " + source_filename)

        # output the geojson
        with open (os.path.join(output_path, output_name + ".geojson"), "rb") as geojsonfile:
            outputgeojson = json.loads(geojsonfile.read().replace('\n', ''))
            geojsonfile.close()
        # prepare response
        response = {}
        response['variables'] = variables
        response['outputgeojson'] = outputgeojson

        return HttpResponse(json.dumps(response), content_type="application/json")

    else:
        return HttpResponse("coming soon")


