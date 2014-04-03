'use strict';

angular.module('rgisApp')
  .directive('toggle', function () {
    return {
      restrict: 'A',
      scope: {},
      link: function postLink(scope, element, attrs) {
        scope.active = false;

        element.bind('click', function(){
          if(scope.active){
            element.removeClass('btn-primary');
          } else {
            element.addClass('btn-primary');
          }

          scope.active = !scope.active;
        });
      }
    };
  });
