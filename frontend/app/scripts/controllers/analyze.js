'use strict';

angular.module('rgisApp')
  .controller('AnalyzeCtrl', function ($scope, Data) {
    $scope.data = Data.getData().geoJsonLayer;
    console.log($scope.data);
  });
