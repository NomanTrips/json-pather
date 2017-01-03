jsonPather.controller('JsonPathCtrl', function ($http, $sce, $location, $mdToast, JsonToHtml, JsonPaths) {
  ctrl = this;
  ctrl.inputJson;
  ctrl.isJsonProcessed = false;
  ctrl.path = '';
  ctrl.paths;

  ctrl.showPath = function (offset) {
    var pathObj = ctrl.paths.find(x => x.offset === offset);
    ctrl.path = pathObj.path;
  };

  ctrl.navToAbout = function () {
    var url = '/about';
    $location.path(url);
  }

  ctrl.showErrorToast = function () {
    $mdToast.show(
      $mdToast.simple()
        .textContent('Invalid Json!')
        .position('top right')
        .hideDelay(3000)
    );
  };

  ctrl.processJson = function () {
    try {
      jsonObj = JSON.parse(ctrl.inputJson);
    } catch (error) {
      ctrl.showErrorToast();
      return;
    }
    ctrl.paths = JsonPaths.objectToPaths(jsonObj);
    var html = JsonToHtml.parseJsonToHtml(jsonObj);
    ctrl.jsonHtml = $sce.trustAsHtml(html);
    ctrl.isJsonProcessed = true;
  }

  ctrl.initPageWithExample = function () {
    $http({
      method: 'GET',
      url: './assets/example.json'
    }).then(function successCallback(response) {
      ctrl.inputJson = JSON.stringify(response.data, undefined, 2);
      ctrl.processJson();
    }, function errorCallback(response) {
      // called asynchronously if an error occurs
      // or server returns response with an error status.
    });
  }

  ctrl.initPageWithExample();

})

  .controller('ToastCtrl', function ($scope, $mdToast) {
    $scope.closeToast = function () {
      $mdToast.hide();
    };
  });
