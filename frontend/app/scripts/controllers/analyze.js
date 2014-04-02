'use strict';

angular.module('rgisApp')
  .controller('AnalyzeCtrl', function ($scope, Data, $http, d3, _, colorbrewer) {
    $scope.geojson = Data.getData().geoJsonLayer;
    $scope.data = Data.getData().dataLayer;

    $scope.mapLayers = [];
    $scope.config = [];

    // SAMPLE GRAPH
    $http.get('sample_output.json').then(function(res){
      $scope.graph = res.data.graph;
    });
    $scope.initKFunction = function(){
      var data = {
        window: $scope.window,
        point: $scope.point
      };

      console.log(data);
      $http.post('/fileupload/api/plugin/kfunction/initialize/', data).then(function(res){
        $scope.graph = res.data.graph;
      });
    };

    $scope.getColorScale = function(data, valName, colors){
      var reduce = _.map(data.features, function(d){
        return parseFloat(d.properties[valName]);
      });

      var color = d3.scale.quantize()
          .domain(d3.extent(reduce))
          .range(colors);

      var getColor = function(d){
        console.log(color(d));
        return color(d);
      };

      return getColor;
    };

    // SAMPLE CONFIG CODE

    // var colorOne = $scope.getColorScale($scope.geojson[0], 'level', colorbrewer.GnBu[8]);
    // var colorTwo = $scope.getColorScale($scope.geojson[1], 'PNTCNT', colorbrewer.PuBu[4]);

    // $scope.config = [
    //   {
    //     style: function(feature){
    //       return {
    //         weight: 10,
    //         opacity: 1,
    //         color: colorOne(feature.properties.level),
    //         fillOpacity: 0.8
    //       };
    //     }
    //   },
    //   {
    //     style: function(feature){
    //       return {
    //         weight: 0,
    //         opacity: 1,
    //         fillColor: colorTwo(feature.properties.PNTCNT),
    //         fillOpacity: 0.8
    //       };
    //     }
    //   },
    // ];
  });
