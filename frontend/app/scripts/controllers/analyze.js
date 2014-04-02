'use strict';

angular.module('rgisApp')
  .controller('AnalyzeCtrl', function ($scope, Data, $http, d3, _, colorbrewer) {
    $scope.geojson = Data.getData().geoJsonLayer;
    $scope.data = Data.getData().dataLayer;

    $scope.mapLayers = [];
    $scope.config = [];

    // SAMPLE GRAPH
    // $http.get('sample_output.json').then(function(res){
    //   $scope.graph = res.data.graph;
    // });
    if(Data.getGraph().data){
      var d = Data.getGraph();
      $scope.window = d.window;
      $scope.point = d.point;
      $scope.graph = d.data;
    }
    
    $scope.initKFunction = function(){
      var data = {
        window: $scope.window,
        point: $scope.point
      };

      console.log(data);
      $http.post('/fileupload/api/plugin/kfunction/initialize/', data).then(function(res){
        // Cache the graph
        Data.storeGraph({
          window: $scope.window,
          point: $scope.point,
          data: res.data.graph
        });

        $scope.graph = res.data.graph;
      });
    };

    $scope.calcKDE = function(val){
      var data = {
        window: $scope.window,
        point: $scope.point,
        bandwidth: val
      };

      $http.post('/fileupload/api/plugin/kfunction/kde/', data).then(function(res){
        var geojson = res.data;
        $scope.mapLayers = [geojson];

        var colors = $scope.getColorScale(geojson, 'level', colorbrewer.GnBu[8]);
        $scope.config = [{
          style: function(feature){
            return {
              weight: 10,
              opacity: 1,
              color: colors(feature.properties.level),
              fillOpacity: 0.8
            };
          }
        }];
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
        return color(d);
      };

      return getColor;
    };

    // SAMPLE CONFIG CODE

    // var colorOne = $scope.getColorScale($scope.geojson[0], 'level', colorbrewer.GnBu[8]);
    // var colorTwo = $scope.getColorScale($scope.geojson[1], 'PNTCNT', colorbrewer.PuBu[4]);

    // $scope.config = [
      // {
      //   style: function(feature){
      //     return {
      //       weight: 10,
      //       opacity: 1,
      //       color: colorOne(feature.properties.level),
      //       fillOpacity: 0.8
      //     };
      //   }
      // },
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
