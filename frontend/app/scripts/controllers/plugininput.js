'use strict';

angular.module('rgisApp')
  .controller('PluginInputCtrl', ['$scope', '$modal', '$log', function ($scope, $modal, $log) {
    $scope.openPlugin = function(){
      var modal = $modal.open({
        templateUrl: 'views/kfunction.html',
        controller: 'KfunctionCtrl',
        keyboard: true
      });

      modal.result.then(function(status){
        $log.info('Modal ' + status + ' at: ' + new Date());
      });
    };
  }]);
