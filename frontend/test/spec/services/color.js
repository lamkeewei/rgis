'use strict';

describe('Service: Color', function () {

  // load the service's module
  beforeEach(module('rgisApp'));

  // instantiate service
  var Color;
  beforeEach(inject(function (_Color_) {
    Color = _Color_;
  }));

  it('should do something', function () {
    expect(!!Color).toBe(true);
  });

});
