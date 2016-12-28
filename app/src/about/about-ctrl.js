jsonPather.controller('AboutCtrl', function($location) {
  ctrl = this;
  ctrl.navToAbout = function (){
      var url = '/about';
      $location.path(url);
  }

});