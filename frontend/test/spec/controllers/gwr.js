'use strict';

describe('Controller: GwrCtrl', function () {

  // load the controller's module
  beforeEach(module('rgisApp'));

  var GwrCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    GwrCtrl = $controller('GwrCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
