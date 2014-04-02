'use strict';

angular.module('rgisApp')
  .directive('sidebar', function (L) {
    return {
      restrict: 'A',
      link: function postLink(scope, element, attrs) {
        var height = element.css('height');
        var selectors = angular.element(element.children()[0]);
        selectors.css('height', height);

        var el = document.querySelector('#sidebar');
        L.DomEvent.disableClickPropagation(element[0]);
      }
    };
  });
