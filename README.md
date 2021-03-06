# RGIS - Making R and GIS Sexy

An interactive application that aims to make R and GIS sexy for all. 

## Setting up environment
- Install vagrant
- run `sudo pip install -r /vagrant/backend/hellodjango/requirements.txt`
- create the postgres user `createuser admin`

## Deploying RGIS

__Creating the Database__

- Run `sudo su - postgres` to sign in as postgres to run the following commands
- `createdb djangodb`: to create a database named 'djangodb' 
- Run `python manage.py syncdb` 
    - Creates all the necessary tables for this project
    - You will be prompted to create the superuser account. This is optional and can be used to access the Django admin at http://localhost:8000/admin for managing your database records.

__Starting Rserve__

- Install Rserve following the [installation instructions here](http://www.rforge.net/Rserve/doc.html#inst "Install Rserve")
- Execute `R CMD Rserve.dbg`: for debug mode, or
- `R CMD Rserve`: in the background

__Starting RGIS__

- Navigate to the `rgis/backend/hellodjango` directory
- `python manage.py runserver 0.0.0.0:8080`

# API Reference

## Get User's list of Shapefiles or Create User
__URL Pattern:__ /api/user_files  
__HTTP Method:__ POST  
__Request:__ 
```javascript
{
  username: 'jackrabbit'
}
```

__Expected Response (Success)__
```javascript
// Successful response (user created)
{
  status: 'success'
}

// Successful response (user exists)
{
  status: 'success',
  files: ['file 1', 'file 2', 'file 3', ...] 
}
```

__Expected Response (Error)__
```javascript
// Error response
{
  status: 'error',
  message: 'username not provided'
}
```

## Get User's Shapefile in .geojson Format
__URL Pattern:__ /api/get_user_file  
__HTTP Method:__ POST  
__Request:__ 
```javascript
{
  username: 'jackrabbit',
  name: 'carrotzone'
}
```

__Expected Response (Success)__
```javascript
// Successful response
{
  // GeoJSON output
}

```

__Expected Response (Error)__
```javascript
// Error response
{
  status: 'error',
  message: 'username not provided'
}
```

## Shapefile Data Upload

__URL Pattern:__ /api/upload  
__HTTP Method:__ POST  
__Request:__ 

- Parameter `shapefile`: Zip file with data
- Parameter `name`: Unique name for this data layer
- Parameter `projection`: (Optional) EPSG projection, e.g. EPSG:4326

__Expected Response (Success)__
```javascript
// Successful response
{
  // GeoJSON conversion of shapefile in WGS 84 projection
}
```

__Expected Response (Error)__
```javascript
// Error response
{
  status: 'error',
  message: 'Provide appropriate error message'
}
```

## KDE (Initialize)

__URL Pattern:__ /api/plugin/kfunction/initialize  
__HTTP Method:__ POST  
__Request:__  
```javascript
{
  point: 'point layer name',
  window: 'window layer name'
}
```

__Expected Response (Success)__
```javascript
// Successful response
{
  status: 'success',
  type: 'graph', //can take in values of graph or map
  graph: [
    {
      r: 10.0,
      obs: 10.0,
      lo: 14.0,
      hi: 4.0
    },
    {
      r: 12.0,
      obs: 12.0
      lo: 17.0,
      hi: 7.0
    },
    {
      r: 14.0,
      obs: 14.0
      lo: 20.0,
      hi: 12.0
    }
  ],
  window: //GeoJSON of window layer,
  points: //GeoJSON of window layer,
}
```

__Expected Response (Error)__
```javascript
// Error response
{
  status: 'error',
  message: 'Provide appropriate error message'
}
```

## KDE (Calculation)
__URL Pattern:__ /api/plugin/kfunction/kde  
__HTTP Method:__ POST  
__Request:__  
```javascript
{
  point: 'point layer name',
  window: 'window layer name',
  bandwidth: '<radius in WGS84 map units>'
}
```

__Expected Response (Success)__
```javascript
// Successful response
{
  // GeoJSON of KDE contours
}
```

__Expected Response (Error)__
```javascript
// Error response
{
  status: 'error',
  message: 'Provide appropriate error message'
}
```

## Geographically Weighted Regression (Initialization)
__URL Pattern:__ /api/plugin/correlation/initialize  
__HTTP Method:__ POST  
__Request:__  
```javascript
{
  namespace: 'unique namespace',
}
```
__Expected Response (Success)__
```javascript
// Successful response
{
  status: 'success',
  variables: ['var 1', 'var 2', 'var 3', ...] // numeric attributes of the shapefile
}
```

__Expected Response (Error)__
```javascript
// Error response
{
  status: 'error',
  message: 'Provide appropriate error message'
}
```

## Geographically Weighted Regression (Chloropleth)
__URL Pattern:__ /api/plugin/correlation/plot  
__HTTP Method:__ POST  
__Request:__  
```javascript
{
  namespace: 'unique namespace',
  dependent: 'dependent variable name',
  independent: ['var 1', 'var 2', 'var 3', ...],
}
```
__Expected Response (Success)__
```javascript
// Successful response
{
  status: 'success',
  outputgeojson: // GeoJSON output,
  variables: ['var x', 'var y', 'var z', ...] // numeric output variables of spgwr's gwr function in R
}
```

__Expected Response (Error)__
```javascript
// Error response
{
  status: 'error',
  message: 'Provide appropriate error message'
}
```
