'use strict';

angular.module('rgisApp')
  .factory('Data', function ($http, $q, _) {
    // Initialize data
    var data = {};
    data.dataLayer = [];
    data.geoJsonLayer = [];

    var promise = $http.get('/fileupload/api/get_csrftoken/');

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
