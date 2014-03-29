'use strict';

angular.module('rgisApp')
  .directive('sidebar', function () {
    return {
      restrict: 'A',
      link: function postLink(scope, element, attrs) {
        var height = element.css('height');
        var selectors = angular.element(element.children()[0]);
        selectors.css('height', height);
      }
    };
  });
