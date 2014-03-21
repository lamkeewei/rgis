'use strict';

angular.module('rgisApp')
  .controller('PluginInputCtrl', ['$scope', '$modal', '$log', '$http', function ($scope, $modal, $log, $http) {
    $http.get('sample_output.json').then(function(response){
      $scope.data = response.data.graph;
    });

    $scope.options = {
      axes: {
        x: {key: 'r', type: 'linear'},
        y: {type: 'linear'}
      },
      series: [
        {y: 'obs', label: 'K Function', color: '#d62728'},
        {y: 'hi', label: 'K Function', color: 'black'},
        {y: 'lo', label: 'K Function', color: 'black'}
      ],
      lineMode: 'linear',
      tooltipMode: 'default'
    };

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
