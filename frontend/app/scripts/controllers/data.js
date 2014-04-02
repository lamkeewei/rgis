'use strict';

angular.module('rgisApp')
  .controller('DataCtrl', function ($scope, $http, _, $modal, $log, Data) {
    $scope.data = Data.getData().dataLayer;
    $scope.selectDataName = 0;
    $scope.selectedData = $scope.data[$scope.selectDataName].data;
    
    $scope.$watch('selectDataName', function(newVal, oldVal){
      if($scope.data[newVal]){
        $scope.selectedData = $scope.data[newVal].data;
      }
    });

    $scope.openPlugin = function(){
      var modal = $modal.open({
        templateUrl: 'views/fileupload.html',
        controller: 'UploadCtrl',
        keyboard: true
      });

      modal.result.then(function(data){
        $scope.data = Data.addData(data).dataLayer;
      });
    };
  });
