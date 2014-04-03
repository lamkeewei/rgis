'use strict';

angular.module('rgisApp')
  .directive('slideTrigger', function (Data) {
    return {
      restrict: 'A',
      link: function postLink(scope, element, attrs) {
        scope.close = false;
        element.bind('click', function(e){
          var prev = scope.active;
          var panels = document.querySelectorAll('.panel');
          angular.forEach(panels, function(d){
            angular.element(d).css('display', 'none');
          });
          var el = document.getElementById(attrs.panel);
          scope.active = attrs.panel;
          angular.element(el).css('display', 'block');
          

          var container = angular.element(element.parent()[0].parentNode);
          var rightPos = parseInt(container.css('right'));
          
          if(rightPos < 0){
            container.css('right', '0px');
            return;
          }

          if(prev === scope.active) {
            container.css('right', '-435px');
          }
        });
      }
    };
  });
