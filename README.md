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