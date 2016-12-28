'use strict';

var jsonPather = angular.module('jsonPather', ['ngSanitize', 'ngMaterial', 'ui.router',])
  .config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('');

    $stateProvider
      .state('root', {
        url: '',
        templateUrl: 'src/json-path/json-path.html',
        controller: 'JsonPathCtrl',
        controllerAs: 'jsonPath',
      })
      .state('about', {
        url: '/about',
        templateUrl: 'src/about/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about',
      });
  })
  .directive('compileTemplate', function($compile, $parse){
    return {
        link: function(scope, element, attr){
            var parsed = $parse(attr.ngBindHtml);
            function getStringValue() { return (parsed(scope) || '').toString(); }

            //Recompile if the template changes
            scope.$watch(getStringValue, function() {
                $compile(element, null, -9999)(scope);  //The -9999 makes it skip directives so that we do not recompile ourselves
            });
        }         
    }
})
.config(function ($mdThemingProvider, $mdIconProvider) {
  $mdIconProvider
    .icon("json", "./assets/svg/json-file.svg", 48)
    .icon("about", "./assets/svg/about.svg", 48);
    
  var lightCyanMap = $mdThemingProvider.extendPalette('cyan', {
    'contrastDefaultColor': 'light'
  });
  $mdThemingProvider.definePalette('lightCyan', lightCyanMap);
  
  $mdThemingProvider.theme('default')
    .primaryPalette('lightCyan', {
      'default': '400',
      'hue-1': 'A200',
    })
    .accentPalette('teal', {
      'default': '400',
      'hue-1': 'A200',
      
    })
    .warnPalette('amber');
});
