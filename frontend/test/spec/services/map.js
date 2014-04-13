'use strict';

describe('Service: Map', function () {

  // load the service's module
  beforeEach(module('rgisApp'));

  // instantiate service
  var map;
  beforeEach(inject(function (_Map_) {
    map = _map_;
  }));

  it('should do something', function () {
    expect(!!map).toBe(true);
  });

});
