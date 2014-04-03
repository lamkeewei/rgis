'use strict';

angular.module('rgisApp')
  .controller('UploadCtrl', function ($scope, $modalInstance, $fileUploader, $cookies) {
    $scope.upload = {};
    $scope.uploading = false;

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
        },
        method: 'POST'
      });
      
      uploader.bind('success', function (event, xhr, item, response) {
        $scope.uploading = false;
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
      $scope.uploading = true;
      $scope.uploader.uploadAll();
    };

    $scope.cancel = function(){
      $modalInstance.close('cancelled');
    };
  });
