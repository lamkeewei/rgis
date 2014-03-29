'use strict';

angular.module('rgisApp')
  .directive('map', function ($window, L) {
    return {
      restrict: 'A',
      scope: {
        data: '=',
        type: '='
      },
      link: function postLink(scope, element, attrs) {
        console.log(scope.data);
        // Initialize map
        var map = L.mapbox.map('map', 'lamkeewei.h6p10hml');

        // Setup listeners on window for responsive map
        angular.element($window).on('resize', function(){
          resizeMap();
        });

        var resizeMap = function(){
          var height = $window.innerHeight - element.offset().top;
          element.css('height', height + 'px');
        };

        resizeMap();

        // Add GeoJSON
        var geojson = L.geoJson(scope.data.data);
        geojson.addTo(map);
      }
    };
  });
