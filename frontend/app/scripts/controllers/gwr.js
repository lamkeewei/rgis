'use strict';

angular.module('rgisApp')
  .controller('GwrCtrl', function ($scope, $http, Map, colorbrewer, Color) {
    $scope.Map = Map;
    $scope.Color = Color;
    $scope.$watch('regressionLayer', function(newVal, oldVal){
      if(newVal >= 0){
        var namespace = $scope.data[newVal].name;

        $http.post('/fileupload/api/plugin/correlation/initialize/', {namespace: namespace}).then(function(res){
          $scope.variables = res.data.variables;
        });
      }
    });

    $scope.gwrIndex = 0;

    $scope.initGWR = function(){
      $scope.flags.running = true;
      var n = $scope.regressionLayer;

      var namespace = $scope.data[n].name;
      var data = {
        namespace: namespace,
        dependent: $scope.dependentVariable,
        independent: $scope.independentVariable
      };

      $http.post('/fileupload/api/plugin/correlation/plot/', data).success(function(data){
        var gjson = data.outputgeojson;
        $scope.Map.mapLayers = [gjson];
        $scope.gwrIndex = $scope.Map.mapLayers.length - 1;
        $scope.chloroVars = data.variables;
        $scope.flags.running = false;
        $scope.flags.gwrRun = true;
        $scope.flags.kdeRun = false;
        $scope.Map.activeLayers = [];
      }).error(function(){
        $scope.flags.running = false;
      });
    };

    $scope.setChloro = function(){
      var colorTwo = $scope.Color.getColorScale($scope.Map.mapLayers[$scope.gwrIndex], $scope.chloroVal, colorbrewer[$scope.Color.gwrColor][$scope.Color.gwrClass]);
      
      $scope.Map.config = [{
        style: function(feature){
          return {
            weight: 2,
            opacity: 1,
            color: 'white',
            fillColor: colorTwo(feature.properties[$scope.chloroVal]),
            fillOpacity: 0.8
          };
        }
      }];

      $scope.flags.change = !$scope.flags.change;
    };

    $scope.$watchCollection('[Color.gwrColor,Color.gwrClass]', function(newVal, oldVal){
      if(!$scope.flags.gwrRun){
        return;
      }

      var colorTwo = $scope.Color.getColorScale($scope.Map.mapLayers[0], $scope.chloroVal, colorbrewer[$scope.Color.gwrColor][$scope.Color.gwrClass]);
      
      $scope.Map.config = [{
        style: function(feature){
          return {
            weight: 2,
            opacity: 1,
            color: 'white',
            fillColor: colorTwo(feature.properties[$scope.chloroVal]),
            fillOpacity: 0.8
          };
        }
      }];

      $scope.flags.change = !$scope.flags.change;
    });
  });
