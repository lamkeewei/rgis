# RGIS - Making R and GIS Sexy

An interactive application that aims to make R and GIS sexy for all. 

## Shapefile Data Upload

__URL Pattern:__ /api/upload  
__HTTP Method:__ POST  
__Request:__ Zip file with data. Parameter name of "file".

__Expected Response (Success)__
```javascript
// Successful response
{
  status: 'success',
  data: // GeoJSON data
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
  namespace: 'unique namespace',
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
  namespace: 'unique namespace',
  point: 'point layer name',
  window: 'window layer name',
  bandwidth: 800
}
```

__Expected Response (Success)__
```javascript
// Successful response
{
  status: 'success',
  namespace: [
    [lat, lng, intensity],
    [lat, lng, intensity],
    [lat, lng, intensity],
    ...
  ]
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
  layer: 'layer name',
  dependent: 'dependent variable name',
  independent: ['var 1', 'var 2', 'var 3', ...]
}
```
__Expected Response (Success)__
```javascript
// Successful response
{
  status: 'success',
  variables: ['var 1', 'var 2', 'var 3', ...]
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

# Geographically Weighted Regression (Chloropleth)
__URL Pattern:__ /api/plugin/correlation/plot  
__HTTP Method:__ POST  
__Request:__  
```javascript
{
  namespace: 'unique namespace',
  layer: 'layer name',
  dependent: 'dependent variable name',
  independent: ['var 1', 'var 2', 'var 3', ...],
  variable: 'selected variable name'
}
```
__Expected Response (Success)__
```javascript
// Successful response
{
  status: 'success',
  data: // GeoJSON output
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