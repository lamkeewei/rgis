'use strict';

describe('Filter: stripUnique', function () {

  // load the filter's module
  beforeEach(module('rgisApp'));

  // initialize a new instance of the filter before each test
  var stripUnique;
  beforeEach(inject(function ($filter) {
    stripUnique = $filter('stripUnique');
  }));

  it('should return the input prefixed with "stripUnique filter:"', function () {
    var text = 'angularjs';
    expect(stripUnique(text)).toBe('stripUnique filter: ' + text);
  });

});
