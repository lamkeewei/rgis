'use strict';

describe('Controller: AnalyzeCtrl', function () {

  // load the controller's module
  beforeEach(module('rgisApp'));

  var AnalyzeCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AnalyzeCtrl = $controller('AnalyzeCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
