'use strict';

angular.module('rgisApp')
  .controller('PluginInputCtrl', ['$scope', '$modal', '$log', '$http', '_', 'd3',
    function ($scope, $modal, $log, $http, _, d3) {

    $http.get('sample_output.json').then(function(response){
      $scope.data = response;
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
  }]);
