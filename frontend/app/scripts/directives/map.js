'use strict';

angular.module('rgisApp')
  .directive('map', function ($window, L, $http, _, d3, colorbrewer) {
    return {
      restrict: 'A',
      scope: {
        data: '=',
        type: '=',
        config: '='
      },
      controller: ['$scope', '$http', function($scope){
        // Initialize map
        $scope.map = L.mapbox.map('map', 'lamkeewei.h6p10hml');

        this.disableDrag = function(){
          console.log('drag disabled');
          $scope.map.dragging.disable();
        };

        this.enableDrag = function(){
          $scope.map.dragging.enable();
        };
      }],
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

        scope.data.forEach(function(d, i){
          var style = scope.config[i].style;
          L.geoJson(d, {style: style}).addTo(map);
        });
      }
    };
  });
