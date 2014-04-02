'use strict';

angular.module('rgisApp')
  .factory('Data', function ($http, $q, _) {
    // Initialize data
    var data = {};

    var promise = $http.get('sample_output.json').then(function(response){
      var dataArr = [];
      var points = response.data.point.features;
      var pointData = _.map(points, function(d){
        return d.properties;
      });

      var polygon = response.data.window.features;
      var polygonData = _.map(polygon, function(d){
        return d.properties;
      });

      dataArr.push({
        name: 'Bedok DGPSZ',
        type: 'polygon',
        data: polygonData
      });

      dataArr.push({
        name: 'Preschools',
        type: 'point',
        data: pointData
      });

      data.dataLayer = dataArr;

      var geoJsonArr = [];
      geoJsonArr.push(response.data.point);
      geoJsonArr.push(response.data.window);
      data.geoJsonLayer = geoJsonArr;
    });

    // Public API here
    return {
      promise: promise,
      getData: function () {
        return data;
      },
      addData: function(obj) {
        var features = obj.data.features;
        var properties = _.map(features, function(d){
          return d.properties;
        });

        data.dataLayer.push({
          name: obj.name,
          type: 'point',
          data: properties
        });

        data.geoJsonLayer.push(obj.data);

        return data;
      }
    };
  });
