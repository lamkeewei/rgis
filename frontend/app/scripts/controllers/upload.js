'use strict';

angular.module('rgisApp')
  .controller('UploadCtrl', function ($scope, $modalInstance, $fileUploader, $cookies) {
    $scope.upload = {};
    var createUploader = function(){
      var uploader = $fileUploader.create({
        scope: $scope,
        alias: 'shapefile',
        url: '/fileupload/api/upload/',
        formData: [
          {
            projection: $scope.upload.crs,
            name: $scope.upload.name
          }
        ],
        headers: {
          'X-CSRFToken': $cookies.csrftoken
        }
      });
      
      uploader.bind('success', function (event, xhr, item, response) {
        $modalInstance.close({
          name: $scope.upload.name,
          data: response
        });
      });

      return uploader;
    };

    $scope.uploader = createUploader();

    $scope.$watch('upload', function(newVal, oldVal){
      $scope.uploader = createUploader();
    }, true);

    $scope.execute = function(){
      $scope.uploader.uploadAll();
    };

    $scope.cancel = function(){
      $modalInstance.close('cancelled');
    };
  });
