
jsonPather.factory('JsonToHtml', function () {
    var factory = this;
    return {
        parseJsonToHtml: function (json) {
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
    }

});