'use strict';

angular.module('rgisApp')
  .controller('KfunctionCtrl', ['$scope', '$modalInstance', 'upload',
    function ($scope, $modalInstance, upload) {

      $scope.execute = function(){
        upload({
          url: '/api/plugin/kfunction',
          data: {
            window: $scope.window,
            points: $scope.points
          }
        }).then(
          function (data) {
            $modalInstance.close(data); // Success
          },
          function (error) {
            $modalInstance.close(error); // Fail
          }
        );
      };

      $scope.cancel = function(){
        $modalInstance.close('cancelled');
      };
    }
  ]);
