'use strict';

angular.module('rgisApp')
  .controller('AnalyzeCtrl', function ($scope, Data, $http, d3, _, colorbrewer, $location) {
    $scope.uniqueName = Data.getUniqueName();

    if(!$scope.uniqueName){
      $location.path('/');
    }
    $scope.active = 'settings';
    $scope.geojson = Data.getData().geoJsonLayer;
    $scope.data = Data.getData().dataLayer;
    $scope.flag = {change: true};
    $scope.mapLayers = [];
    $scope.config = [];
    $scope.running = false;
    $scope.kdeRun = false;
    $scope.gwrRun = false;
    $scope.cb = Object.keys(colorbrewer);

    $scope.kdeColor = 'GnBu';
    $scope.kdeClass = '8';

    $scope.gwrColor = 'OrRd';
    $scope.gwrClass = '6';
    //SAMPLE GRAPH
    // $http.get('sample_output.json').then(function(res){
    //   $scope.graph = res.data.graph;
    // });
    
    $scope.initKFunction = function(){
      $scope.running = true;
      var data = {
        window: $scope.window,
        point: $scope.point
      };

      $http.post('/fileupload/api/plugin/kfunction/initialize/', data).success(function(data){
        // Cache the graph
        // Data.storeGraph({
        //   window: $scope.window,
        //   point: $scope.point,
        //   data: data.graph
        // });

        $scope.graph = data.graph;
        $scope.running = false;
      }).error(function(){
        $scope.running = false;
      });
    };

    $scope.calcKDE = function(val){
      $scope.running = true;
      var data = {
        window: $scope.window,
        point: $scope.point,
        bandwidth: val
      };

      $http.post('/fileupload/api/plugin/kfunction/kde/', data).success(function(data){
        var geojson = data;
        $scope.mapLayers = [geojson];

        var colors = $scope.getColorScale(geojson, 'level', colorbrewer[$scope.kdeColor][$scope.kdeClass]);
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

        $scope.running = false;
        $scope.kdeRun = true;
        $scope.gwrRun = false;
        $scope.activeLayers = [];
      }).error(function(){
        $scope.running = false;
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

    $scope.$watchCollection('[kdeColor,kdeClass]', function(newVal, oldVal){
      if(!$scope.kdeRun){
        return;
      }

      var colors = $scope.getColorScale($scope.mapLayers[0], 'level', colorbrewer[$scope.kdeColor][$scope.kdeClass]);
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

      $scope.flag.change = !$scope.flag.change;
    });

    $scope.$watchCollection('[gwrColor,gwrClass]', function(newVal, oldVal){
      if(!$scope.gwrRun){
        return;
      }

      var colorTwo = $scope.getColorScale($scope.mapLayers[0], $scope.chloroVal, colorbrewer[$scope.gwrColor][$scope.gwrClass]);
      
      $scope.config = [{
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

      $scope.flag.change = !$scope.flag.change;
    });

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
      $scope.running = true;
      var n = $scope.regressionLayer;

      var namespace = $scope.data[n].name;
      var data = {
        namespace: namespace,
        dependent: $scope.dependentVariable,
        independent: $scope.independentVariable
      };

      $http.post('/fileupload/api/plugin/correlation/plot/', data).success(function(data){
        var gjson = data.outputgeojson;
        $scope.mapLayers = [gjson];
        $scope.gwrIndex = $scope.mapLayers.length - 1;
        $scope.chloroVars = data.variables;
        $scope.running = false;
        $scope.gwrRun = true;
        $scope.kdeRun = false;
        $scope.activeLayers = [];
      }).error(function(){
        $scope.running = false;
      });
    };

    $scope.isActive = function(index){
      var i = $scope.activeLayers.indexOf(index);
      return i !== -1;
    };

    $scope.setChloro = function(){
      var colorTwo = $scope.getColorScale($scope.mapLayers[$scope.gwrIndex], $scope.chloroVal, colorbrewer[$scope.gwrColor][$scope.gwrClass]);
      
      $scope.config = [{
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

      $scope.flag.change = !$scope.flag.change;
    };

    $scope.activeLayers = [];
    $scope.addLayer = function(index){
      var pos = $scope.activeLayers.indexOf(index);
      
      if(pos === -1){
        $scope.activeLayers.push(index);
        var layer = $scope.geojson[index];
        $scope.mapLayers.push(layer);
      } else {
        $scope.activeLayers.splice(pos, 1);
        if($scope.gwrRun || $scope.kdeRun){
          pos += 1;
        }
        $scope.mapLayers.splice(pos, 1);
      }
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
      // {
      //   style: function(feature){
      //     return {
      //       weight: 0,
      //       opacity: 1,
      //       fillColor: colorTwo(feature.properties.PNTCNT),
      //       fillOpacity: 0.8
      //     };
      //   }
      // },
    // ];
  });
