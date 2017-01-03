jsonPather.factory('JsonPaths', function () {
    var factory = this;
    return {
        objectToPaths: function (data) {
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
    }
});