jsonPather.controller('JsonPathCtrl', function ($http, $sce, $location, $mdToast, JsonToHtml) {
  ctrl = this;
  ctrl.inputJson;
  ctrl.isJsonProcessed = false;
  ctrl.path = '';

  ctrl.showPath = function (offset) {
    var pathObj = ctrl.paths.find(x => x.offset === offset);
    ctrl.path = pathObj.path;
  };

  ctrl.navToAbout = function () {
    var url = '/about';
    $location.path(url);
  }

  ctrl.parseJsonToHtml = function (json) {
    var realOffset;
    var currentStrIndex = 0;
    if (typeof json != 'string') {
      json = JSON.stringify(json, undefined, 2);
    }
    var originalJson = json;
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match, p1, p2, p3, offset, string) {
      var cls = 'number';
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = 'key';
        } else {
          cls = 'string';
        }
      } else if (/true|false/.test(match)) {
        cls = 'boolean';
      } else if (/null/.test(match)) {
        cls = 'null';
      }

      realOffset = originalJson.indexOf(match, currentStrIndex); // offset later used to map the value to the corresponding path from objectToPaths
      currentStrIndex = realOffset + match.length;
      if (cls === 'string') {
        return "<md-button ng-click='jsonPath.showPath(" + realOffset + ")' class='md-small md-primary'>" + match + "</md-button>";
      } else {
        return "<span class=" + cls + ">" + match + "</span>";
      }

    });
  }

  ctrl.paths;

  ctrl.objectToPaths = function (data) {
    var validId = /^[a-z_$][a-z0-9_$]*$/i;
    var result = [];
    var dataString = JSON.stringify(data, undefined, 2);
    var offset; // offset used later to map paths to json values in html version of json
    var currentStrIndex = 0;
    doIt(data, "");
    return result;

    function doIt(data, s) {
      if (data && typeof data === "object") {
        if (Array.isArray(data)) {
          for (var i = 0; i < data.length; i++) {
            doIt(data[i], s + "[" + i + "]");

            if (typeof data[i] == 'string') {
              offset = (dataString.indexOf(data[i], currentStrIndex) - 1);
              currentStrIndex = offset + data[i].length;
              result[result.length - 1].offset = offset;
            }
          }
        } else {
          for (var p in data) {
            if (validId.test(p)) {
              doIt(data[p], s + "." + p);

              if (typeof data[p] == 'string') {
                offset = (dataString.indexOf(data[p], currentStrIndex) - 1);
                currentStrIndex = offset + data[p].length;
                result[result.length - 1].offset = offset;
              }
            } else {
              doIt(data[p], s + "[\"" + p + "\"]");
              console.log(s + ' ' + p);
            }
          }
        }
      } else {
        result.push({ path: s, offset: null });
      }
    }
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
    ctrl.paths = ctrl.objectToPaths(jsonObj);
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
      jsonObj = response.data;
      ctrl.paths = ctrl.objectToPaths(jsonObj);
      ctrl.path = ctrl.paths[3].path;
      var html = JsonToHtml.parseJsonToHtml(jsonObj);
      ctrl.jsonHtml = $sce.trustAsHtml(html);
      ctrl.isJsonProcessed = true;
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
