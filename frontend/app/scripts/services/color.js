'use strict';

angular.module('rgisApp')
  .factory('Color', function (d3, _) {
    return {
      kdeColor: 'GnBu',
      kdeClass: '8',
      gwrColor: 'OrRd',
      gwrClass: '6',
      range: [],
      getColorScale: function(data, valName, colors){
        var reduce = _.map(data.features, function(d){
          return parseFloat(d.properties[valName]);
        });

        this.range = d3.extent(reduce);
        
        var color = d3.scale.quantize()
            .domain(d3.extent(reduce))
            .range(colors);

        var getColor = function(d){
          return color(d);
        };

        return getColor;
      }
    };
  });
