'use strict';

angular.module('rgisApp')
  .factory('Map', function () {
    // Public API here
    return {
      mapLayers: [],
      config: [],
      activeLayers: [],
      getMapLayers: function () {
        return this.mapLayers;
      },
      getConfig: function(){
        return this.config;
      },
      getActiveLayers: function(){
        return this.activeLayers;
      }
    };
  });
