'use strict';

angular.module('rgisApp')
  .controller('AnalyzeCtrl', function ($scope, Data, $http) {
    $scope.data = Data.getData().geoJsonLayer;
    console.log($scope.data);

    $http.get('sample_output.json').then(function(res){
      $scope.graph = res.data.graph;
    });
  });
