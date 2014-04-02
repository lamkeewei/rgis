'use strict';

angular.module('rgisApp')
  .directive('sidebar', function (L) {
    return {
      restrict: 'A',
      link: function postLink(scope, element, attrs) {
        var height = element.css('height');
        var selectors = angular.element(element.children()[0]);
        selectors.css('height', height);

        var pluginInput = angular.element(element.children()[1]);
        console.log(pluginInput.children());
        var hide = angular.element(pluginInput.children()[1]);
        hide.css('display', 'none');

        L.DomEvent.disableClickPropagation(element[0]);
      }
    };
  });
