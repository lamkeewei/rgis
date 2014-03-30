'use strict';

angular.module('rgisApp')
  .directive('map', function ($window, L) {
    return {
      restrict: 'A',
      scope: {
        data: '=',
        type: '='
      },
      controller: function($scope){
        // Initialize map
        $scope.map = L.mapbox.map('map', 'lamkeewei.h6p10hml');

        this.disableDrag = function(){
          console.log('drag disabled');
          $scope.map.dragging.disable();
        };

        this.enableDrag = function(){
          $scope.map.dragging.enable();
        };
      },
      link: function postLink(scope, element, attrs) {
        var map = scope.map;
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
