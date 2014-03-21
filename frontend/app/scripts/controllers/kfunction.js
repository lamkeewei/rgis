'use strict';

angular.module('rgisApp')
  .controller('KfunctionCtrl', ['$scope', '$modalInstance',
    function ($scope, $modalInstance) {
      $scope.execute = function(){
        $modalInstance.close('executed');
      };

      $scope.cancel = function(){
        $modalInstance.close('cancelled');
      };
    }
  ]);
