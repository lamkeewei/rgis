'use strict';

angular.module('rgisApp')
  .controller('UploadCtrl', function ($scope, $modalInstance, $fileUploader, $cookies) {
    $scope.upload = {};
    $scope.upload.crs = 'EPSG:4326';
    var uploader = $scope.uploader = $fileUploader.create({
      scope: $scope,
      url: '/fileupload/api/upload/',
      formData: [
        {
          projection: $scope.upload.crs,
          name:'lamkeewei'
        }
      ],
      headers: {
        'X-CSRFToken': $cookies.csrftoken
      }
    });

    $scope.execute = function(){
      console.log('hello');
      uploader.uploadAll();
    };

    $scope.cancel = function(){
      $modalInstance.close('cancelled');
    };
  });
