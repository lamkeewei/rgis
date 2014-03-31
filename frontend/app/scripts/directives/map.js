'use strict';

angular.module('rgisApp')
  .directive('map', function ($window, L, $http, _, d3) {
    return {
      restrict: 'A',
      scope: {
        data: '=',
        type: '='
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

        // Add GeoJSON
        // $http.get('Bedok_Population.geojson').then(function(res){
        //   var data = res.data.features;
        //   var reduce = _.map(data, function(d){
        //     return d.properties.Total;
        //   });

        //   var colorbrewer = {
        //     GnBu: {
        //       3: ['#fde0dd','#fa9fb5','#c51b8a'],
        //       4: ['#feebe2','#fbb4b9','#f768a1','#ae017e'],
        //       5: ['#feebe2','#fbb4b9','#f768a1','#c51b8a','#7a0177'],
        //       6: ['#feebe2','#fcc5c0','#fa9fb5','#f768a1','#c51b8a','#7a0177'],
        //       7: ['#feebe2','#fcc5c0','#fa9fb5','#f768a1','#dd3497','#ae017e','#7a0177'],
        //       8: ['#fff7f3','#fde0dd','#fcc5c0','#fa9fb5','#f768a1','#dd3497','#ae017e','#7a0177'],
        //       9: ['#fff7f3','#fde0dd','#fcc5c0','#fa9fb5','#f768a1','#dd3497','#ae017e','#7a0177','#49006a']
        //     }
        //   };

        //   var color = d3.scale.quantize().
        //     domain(d3.extent(reduce)).
        //     range(colorbrewer.GnBu[8]);

        //   var getColor = function(d) {
        //     return color(d);
        //   };

        //   var style = function (feature) {
        //       return {
        //           fillColor: getColor(feature.properties.Total),
        //           weight: 2,
        //           opacity: 1,
        //           color: 'white',
        //           fillOpacity: 0.8
        //         };
        //     };

        //   console.log(res.data);
        //   var geojson = L.geoJson(res.data, {style: style});
        //   geojson.addTo(map);
        // });
      }
    };
  });
