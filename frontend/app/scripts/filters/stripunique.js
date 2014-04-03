'use strict';

angular.module('rgisApp')
  .filter('stripUnique', function (Data) {
    return function (input) {
      var uniqueName = Data.getUniqueName() + '_';

      return input.replace(uniqueName, '');
    };
  });
