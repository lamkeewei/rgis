'use strict';

angular.module('rgisApp')
  .controller('AnalyzeCtrl', function ($scope, Data, $http) {
    $scope.geojson = Data.getData().geoJsonLayer;
    $scope.data = Data.getData().dataLayer;

    console.log($scope.data);

    $http.get('sample_output.json').then(function(res){
      $scope.graph = res.data.graph;
    });
  });
