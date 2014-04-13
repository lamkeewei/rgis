'use strict';

angular.module('rgisApp')
  .directive('colorScale', function (Color, colorbrewer, d3) {
    return {
      template: '<div></div>',
      restrict: 'A',
      link: function postLink(scope, element, attrs) {
        scope.Color = Color;
        var colorScheme = colorbrewer[scope.Color.gwrColor][scope.Color.gwrClass];
        var elWidth = 280;
        var svg = d3.select(element[0])
          .append('svg');


        var width = 280 / colorScheme.length;

        svg.selectAll('rect')
          .data(colorScheme)
            .enter()
            .append('rect')
            .attr('width', width)
            .attr('height', 10)
            .attr('x', function(d, i) { return i * width; });

        svg.append('text')
          .attr('id', 'min-val')
          .attr('y', 25)
          .attr('font-size', '9pt')
          .text('Low');

        svg.append('text')
          .attr('id', 'max-val')
          .attr('x', 240)
          .attr('y', 25)
          .attr('font-size', '9pt')
          .text('High');

        scope.$watch('Color', function(newVal, oldVal){
          if(scope.Color.range.length > 0){
            var range = scope.Color.range;
            d3.select('#min-val').text(range[0].toFixed(3));
            d3.select('#max-val').text(range[1].toFixed(3));
          }
          var color = newVal;
          var colorScheme = colorbrewer[newVal.gwrColor][newVal.gwrClass];

          width = elWidth / colorScheme.length;
          svg.selectAll('rect')
            .data(colorScheme)
              .enter()
              .append('rect')
              .attr('width', width)
              .attr('height', 10)
              .attr('x', function(d, i) { return i * width; });

          svg.selectAll('rect')
            .data(colorScheme)
            .attr('width', width)
            .attr('x', function(d, i) { return i * width; })
            .style('fill', function(d){
              return d;
            });
        }, true);
      }
    };
  });
