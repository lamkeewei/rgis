'use strict';

angular.module('rgisApp')
  .controller('DataCtrl', function ($scope, $http, _, $modal, $log, Data) {
    $scope.uniqueName = Data.getUniqueName();
    $scope.init = function(){
      $http.get('/fileupload/api/initialize/').success(function(){
        console.log('reset');
      });
      
      var modal = $modal.open({
        templateUrl: 'views/signin.html',
        backdrop: 'static',
        keyboard: false
      });

      modal.result.then(function(name){
        if(!name){
          console.log('empty');
          $scope.init();
        }

        Data.setUniqueName(name);
      });
    };

    if(!$scope.uniqueName){
      $scope.init();
    }

    $scope.data = Data.getData().dataLayer;
    $scope.selectDataName = 0;
    if($scope.data.length > 0){
      $scope.selectedData = $scope.data[$scope.selectDataName].data;
    }
    
    $scope.$watch('selectDataName', function(newVal, oldVal){
      console.log('changed');
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
        $scope.selectedData = $scope.data[$scope.data.length - 1].data;
        $scope.selectDataName = $scope.data.length - 1;
      });
    };

    $scope.isSelected = function(index){
      return $scope.selectDataName === index;
    };
  });
