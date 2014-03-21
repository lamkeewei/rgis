'use strict';

describe('Directive: fileInput', function () {

  // load the directive's module
  beforeEach(module('rgisApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<file-input></file-input>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the fileInput directive');
  }));
});
