'use strict';

angular.module('rgisApp')
  .directive('slideTrigger', function () {
    return {
      restrict: 'A',
      link: function postLink(scope, element, attrs) {
        element.bind('click', function(e){
          var container = angular.element(element.parent()[0].parentNode);
          var rightPos = parseInt(container.css('right'));
          if(rightPos >= 0) {
            container.css('right', '-435px');
          }else{
            container.css('right', '0px');
          }
        });
      }
    };
  });
