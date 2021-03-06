'use strict';

angular.module('rgisApp')
  .directive('map', function ($window, L, $http, _, d3, colorbrewer) {
    return {
      restrict: 'A',
      scope: {
        data: '=',
        type: '=',
        config: '=',
        flag: '='
      },
      controller: ['$scope', '$http', function($scope){
        // Initialize map
        $scope.map = L.mapbox.map('map', 'lamkeewei.h6p10hml', {
          scrollWheelZoom: false
        });
        // $scope.map.setView([1.321651, 103.932106], 10);

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
        var layerGrp = new L.LayerGroup();

        var loadLayers = function(){
          scope.data.forEach(function(d, i){
            var layer;

            if(scope.config[i]){
              var style = scope.config[i].style;
              layer = L.geoJson(d, {style: style});
            } else {
              layer = L.geoJson(d);
            }

            layerGrp.addLayer(layer);
          });
          layerGrp.addTo(map);
        };

        var setViewArea = function(){
          if(scope.data.length > 0){
            var layers = layerGrp.getLayers();
            var bounds = layers[layers.length - 1].getBounds();
            map.fitBounds(bounds);
          }
        };

        loadLayers();

        scope.$watch('data', function(newVal, oldVal){
          layerGrp.clearLayers();
          loadLayers();
          setViewArea();
        }, true);

        scope.$watch('config', function(newVal, oldVal){
          console.log('changed config');
          layerGrp.clearLayers();
          loadLayers();
          setViewArea();
        }, true);

        scope.$watch('flag', function(newVal, oldVal){
          console.log('changed config');
          layerGrp.clearLayers();
          loadLayers();
        }, true);
      }
    };
  });
