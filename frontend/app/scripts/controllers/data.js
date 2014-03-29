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

    $scope.openPlugin = function(pluginName, controller){
      var modal = $modal.open({
        templateUrl: 'views/' + pluginName + '.html',
        controller: controller,
        keyboard: true
      });

      modal.result.then(function(status){
        $log.info('Reply received!');
      });
    };
  });
