'use strict';

angular.module('rgisApp')
  .directive('fileInput', function () {
    return {
      templateUrl: 'views/fileInput.html',
      restrict: 'A',
      link: function postLink(scope, element, attrs) {
        // Grab the element that is available
        var textInput = angular.element(element.children().children()[0]);
        var file = angular.element(element.children().children()[1]);
        var button = angular.element(element.children().children()[2]);

        // Make file input invisible 
        file.css('display', 'none');

        // Bind the click button to trigger file input dialog
        button.bind('click', function(){
          file.click();
        });

        // On file selection update the text input with the name of the file
        file.bind('change', function(e){
          var fileName = file.val().split('\\');
          fileName = fileName[fileName.length - 1];
          textInput.val(fileName);
        });
      }
    };
  });
