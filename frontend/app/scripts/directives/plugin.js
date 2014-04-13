'use strict';

angular.module('rgisApp')
  .directive('plugin', function () {
    return {
      templateUrl: function(tElements, tAttrs){
        var pluginName = tAttrs.plugin;
        return 'views/' + pluginName + '.html';
      },
      restrict: 'A',
      transclude: true
    };
  });
