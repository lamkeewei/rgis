'use strict';

angular.module('rgisApp')
  .controller('KdeCtrl', function ($scope, $http, colorbrewer, Map, Color) {
    $scope.Map = Map;
    $scope.Color = Color;

    $scope.initKFunction = function(){
      $scope.flags.running = true; // Refactor out to a global state service
      var data = {
        window: $scope.window,
        point: $scope.point
      };

      $http.post('/fileupload/api/plugin/kfunction/initialize/', data).success(function(data){
        $scope.graph = data.graph;
        $scope.flags.running = false;
      }).error(function(){
        $scope.flags.running = false;
      });
    };

    $scope.calcKDE = function(val){
      $scope.flags.running = true;
      var data = {
        window: $scope.window,
        point: $scope.point,
        bandwidth: val
      };

      $http.post('/fileupload/api/plugin/kfunction/kde/', data).success(function(data){
        var geojson = data;
        $scope.Map.mapLayers = [geojson];

        var colors = $scope.Color.getColorScale(geojson, 'level', colorbrewer[$scope.Color.kdeColor][$scope.Color.kdeClass]);
        $scope.Map.config = [{
          style: function(feature){
            return {
              weight: 10,
              opacity: 1,
              color: colors(feature.properties.level),
              fillOpacity: 0.8
            };
          }
        }];

        $scope.flags.running = false;
        $scope.flags.kdeRun = true; // Refactor to a global state service
        $scope.flags.gwrRun = false; // Refactor to a global state service
        Map.activeLayers = [];
      }).error(function(){
        $scope.flags.running = false;
      });
    };

    $scope.$watchCollection('[Color.kdeColor,Color.kdeClass]', function(newVal, oldVal){
      if(!$scope.flags.kdeRun){
        return;
      }

      var colors = $scope.Color.getColorScale($scope.Map.mapLayers[0], 'level', colorbrewer[$scope.Color.kdeColor][$scope.Color.kdeClass]);
      $scope.Map.config = [{
        style: function(feature){
          return {
            weight: 10,
            opacity: 1,
            color: colors(feature.properties.level),
            fillOpacity: 0.8
          };
        }
      }];

      console.log(colors);
      console.log($scope.Map.config);
      $scope.flags.change = !$scope.flags.change;
    });
  });
