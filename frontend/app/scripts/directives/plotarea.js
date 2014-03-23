'use strict';

angular.module('rgisApp')
  .directive('plotArea', ['d3', function (d3) {
    return {
      restrict: 'A',
      scope: {
        'data': '='
      },
      link: function postLink(scope, element, attrs) {
        var elWidth = parseFloat(d3.select(element[0]).style('width'));
        var proportion = 0.7;

        var margin = {top: 20, right: 20, bottom: 30, left: 50},
            width = elWidth - margin.left - margin.right,
            height = proportion * elWidth - margin.top - margin.bottom;

        var x = d3.scale.linear()
          .range([0, width]);

        var y = d3.scale.linear()
          .range([height, 0]);

        var xAxis = d3.svg.axis()
          .scale(x)
          .orient('bottom');

        var yAxis = d3.svg.axis()
          .scale(y)
          .orient('left');

        var empirical = d3.svg.line()
          .x(function(d){ return x(d.r); })
          .y(function(d){ return y(d.obs); });

        var upper = d3.svg.line()
          .x(function(d){ return x(d.r); })
          .y(function(d){ return y(d.hi); });

        var lower = d3.svg.line()
          .x(function(d){ return x(d.r); })
          .y(function(d){ return y(d.lo); });

        var area = d3.svg.area()
          .x(function(d){ return x(d.r); })
          .y0(function(d){ return y(d.lo); })
          .y1(function(d){ return y(d.hi); });

        var svg = d3.select(element[0]).append('svg')
              .attr('width', width + margin.left + margin.right)
              .attr('height', height + margin.top + margin.bottom)
            .append('g')
              .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

        scope.render = function(data){
          // elWidth = parseFloat(d3.select(element[0]).style('width'));

          // width = elWidth - margin.left - margin.right;
          // height = proportion * elWidth - margin.top - margin.bottom;

          // d3.select(element[0]).select('svg')
          //   .attr('width', width + margin.left + margin.right)
          //   .attr('height', height + margin.top + margin.bottom);

          x.domain(d3.extent(data, function(d){ return d.r; }));
          y.domain([d3.min(data, function(d){ return d.hi; }), d3.max(data, function(d){ return d.lo; })]);

          svg.append('g')
            .attr('class', 'x axis')
            .attr('transform', 'translate(0,' + height + ')')
            .call(xAxis);

          svg.append('g')
            .attr('class', 'y axis')
            .call(yAxis)
          .append('text')
            .attr('transform', 'rotate(-90)')
            .attr('y', 6)
            .attr('dy', '.71em')
            .style('text-anchor', 'end')
            .text('L function');

          svg.append('path')
            .datum(data)
            .attr('class', 'area')
            .attr('d', area);

          svg.append('path')
            .datum(data)
            .attr('class', 'line bounds')
            .attr('d', upper);

          svg.append('path')
            .datum(data)
            .attr('class', 'line bounds')
            .attr('d', lower);

          svg.append('path')
            .datum(data)
            .attr('class', 'line')
            .attr('d', empirical);
        };

        window.onresize = function() {
          scope.$apply();
        };

        scope.$watch('data', function(newVals, oldVals) {
          if(newVals){
            scope.render(newVals);
          }
        }, true);
      }
    };
  }]);
