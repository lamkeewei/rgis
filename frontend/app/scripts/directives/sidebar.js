'use strict';

angular.module('rgisApp')
  .directive('sidebar', function (L) {
    return {
      restrict: 'A',
      link: function postLink(scope, element, attrs) {
        var panels = document.querySelectorAll('.panel');
        angular.forEach(panels, function(d){
          angular.element(d).css('display', 'none');
        });
        var height = element.css('height');
        var selectors = angular.element(element.children()[0]);
        selectors.css('height', height);

        var pluginInput = angular.element(element.children()[1]);
        var unhide = angular.element(pluginInput.children()[0]);
        unhide.css('display', 'block');
        // hide.css('display', 'none');

        L.DomEvent.disableClickPropagation(element[0]);
      }
    };
  });
