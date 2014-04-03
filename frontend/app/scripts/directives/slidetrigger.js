'use strict';

angular.module('rgisApp')
  .directive('slideTrigger', function (Data) {
    return {
      restrict: 'A',
      link: function postLink(scope, element, attrs) {
        scope.close = false;
        element.bind('click', function(e){
          var panels = document.querySelectorAll('.panel');
          angular.forEach(panels, function(d){
            angular.element(d).css('display', 'none');
          });
          var el = document.getElementById(attrs.panel);
          angular.element(el).css('display', 'block');
          
          // var id = attrs.panel;

          // if(id === 'kfunction' && Data.getGraph().data){
          //   console.log('hello');
          //   var d = Data.getGraph();
          //   scope.window = d.window;
          //   scope.point = d.point;
          //   scope.graph = d.data;
          //   scope.$apply();
          // }

          // var container = angular.element(element.parent()[0].parentNode);
          // var rightPos = parseInt(container.css('right'));
          
          // if(scope.close) {
          //   container.css('right', '0px');
          // }else{
          //   container.css('right', '-435px');
          // }

          // scope.close = !scope.close;
        });
      }
    };
  });
