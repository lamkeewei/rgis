'use strict';

angular.module('rgisApp')
  .directive('datatable', function ($window) {
    return {
      templateUrl: 'views/datatable.html',
      restrict: 'A',
      replace: true,
      scope: {
        data: '=datatable',
        search: '=search'
      },
      link: function postLink(scope, element, attrs) {
        angular.element($window).on('resize', function(){
          resizeTable();
        });

        var resizeTable = function(){
          var table = angular.element(element.children()[1]);
          var height = $window.innerHeight - table.offset().top;

          table.css('height', height + 'px');
        };

        var table = angular.element(element.children()[1]);
        var height = $window.innerHeight - table.offset().top - 55 /* CSS hack to make it not scrollable when first open */;

        table.css('height', height + 'px');
      }
    };
  });
