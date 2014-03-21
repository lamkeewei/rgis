'use strict';

angular.module('rgisApp')
  .controller('PluginInputCtrl', function ($scope, $modal) {
    $scope.openPlugin = function(){
      var modal = $modal.open({
        templateUrl: 'views/kfunction.html'
      });
    };
  });
