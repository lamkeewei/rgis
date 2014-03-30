'use strict';

angular.module('rgisApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'ui.bootstrap',
  'lr.upload'
])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        resolve: {
          dataLoaded: ['Data', function(Data){
            return Data.promise;
          }]
        }
      })
      .when('/analyze', {
        templateUrl: 'views/analyze.html',
        controller: 'AnalyzeCtrl',
        resolve: {
          dataLoaded: ['Data', function(Data){
            return Data.promise;
          }]
        }
      })
      .otherwise({
        redirectTo: '/'
      });
  })
  .factory('_', function(){
    return window._;
  })
  .factory('d3', function(){
    return window.d3;
  }).factory('L', function(){
    return window.L;
  });
