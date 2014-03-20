# RGIS - Making R and GIS Sexy

An interactive application that aims to make R and GIS sexy for all. 

## Expected JSON Output

__URL Pattern:__ /api/plugin/_:plugin-id_  
__Request:__ Two zip files. Parameter name of __"window"__ and __"points"__  
__HTTP Method:__ POST

__Expected Response (Success)__
```javascript
// Successful response
{
  status: 'success',
  type: 'graph', //can take in values of graph or map
  graph: [
    {
      x: 10.0,
      y: 10.0,
      max-y: 14.0,
      min-y: 4.0
    },
    {
      x: 12.0,
      y: 12.0
      max-y: 17.0,
      min-y: 7.0
    },
    {
      x: 14.0,
      y: 14.0
      max-y: 20.0,
      min-y: 12.0
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