'use strict';

angular.module('rgisApp')
  .controller('AnalyzeCtrl', function ($scope, Data, $http, d3, _, colorbrewer, $location, Map, Color) {
    $scope.uniqueName = Data.getUniqueName();

    // if(!$scope.uniqueName){
    //   $location.path('/');
    // }

    // Set active panel in analyze page
    $scope.active = 'settings';

    // Retrieve and init the GeoJSON data layers
    $scope.geojson = Data.getData().geoJsonLayer;

    // Retrieve and init the data layers. Used populating the dropdowns
    $scope.data = Data.getData().dataLayer;

    $scope.Map = Map;

    $scope.Color = Color;

    $scope.flags = {
      change: true, // Hack to force a change and refresh on the map
      running: false, // Used to trigger the running progres bar
      kdeRun: false,
      gwrRun: false
    };

    // Hack to make the allow overlays over kde and gwr 
    $scope.flags.kdeRun = false;
    $scope.flags.gwrRun = false;

    // Used as input to the colors selector
    $scope.cb = Object.keys(colorbrewer);

    $scope.isActive = function(index){
      var i = $scope.Map.activeLayers.indexOf(index);
      return i !== -1;
    };

    $scope.addLayer = function(index){
      var pos = $scope.Map.activeLayers.indexOf(index);
      
      if(pos === -1){
        $scope.Map.activeLayers.push(index);
        var layer = $scope.geojson[index];
        $scope.Map.mapLayers.push(layer);
      } else {
        $scope.Map.activeLayers.splice(pos, 1);
        if($scope.flags.gwrRun || $scope.flags.kdeRun){
          pos += 1;
        }
        $scope.Map.mapLayers.splice(pos, 1);
      }
    };
  });
