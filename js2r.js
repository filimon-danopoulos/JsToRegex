var js2r = (function () {
    var expressions = {};


    function JsToRegex() {
        this.guid = Math.floor(Math.random() * 100000000);
    }

    // Static functions and constants
    JsToRegex.create = function (testString) {
        var newInstance = new JsToRegex();
        expressions[newInstance.guid] = {
            orderCounter: 0,
            testString: testString,
            pattern: {},
            previousCall: ""
        };
        return newInstance;
    };

    JsToRegex.DEBUG = true;
    JsToRegex.ANY = ".*";


    // Public methods
    JsToRegex.prototype.isMatch = function () {
        var regex = buildRegex(expressions[this.guid].pattern, expressions[this.guid].orderCounter),
            testString = expressions[this.guid].testString,
            result = regex.test(testString);
        log("isMatch called with the test string: " + testString);
        log("Result of isMatch call: " + result.toString());
        return result;
    };

    JsToRegex.prototype.getMatch = function () {
        var regex = buildRegex(expressions[this.guid].pattern, expressions[this.guid].orderCounter),
            testString = expressions[this.guid].testString,
            result = regex.exec(testString) || [];
        log("getMatch is called with the test string: " + testString);
        log("Result of getMatch call has length: " + result.length);
        if (!result) {
            return [];
        } else {
            return result.slice(1);
        }
    };

    JsToRegex.prototype.startsWith = function (patternString) {
        if (!patternString) {
            throw "Argument missing: patternString";
        }
        log("Pattern string passed to startsWith: " + patternString);
        if (!expressions[this.guid].pattern.startsWith) {
            expressions[this.guid].pattern.startsWith = [];
        }

        if (Object.keys(expressions[this.guid].pattern).filter(function (x) {
            return x !== "startsWith";
        }).shift()) {
            throw "Invalid operation: startsWith can't be called after other conditions are defined";
        }


        expressions[this.guid].pattern.startsWith.push(patternString);
        expressions[this.guid].previousCall = "startsWith";

        return this;
    };

    JsToRegex.prototype.endsWith = function (patternString) {
        if (!patternString) {
            throw "Argument missing: patternString";
        }
        log("Pattern string passed to endsWith: " + patternString);
        if (!expressions[this.guid].pattern.endsWith) {
            expressions[this.guid].pattern.endsWith = [];
        }

        expressions[this.guid].pattern.endsWith.push(patternString);
        expressions[this.guid].previousCall = "endsWith";

        return this;
    };

    JsToRegex.prototype.match = function (patternString) {
        if (!patternString) {
            throw "Argument missing: patternString";
        }
        log("Pattern string passed to match: " + patternString);
        if (!expressions[this.guid].pattern.match) {
            expressions[this.guid].pattern.match = [];
        }

        expressions[this.guid].pattern.match.push({
            order: expressions[this.guid].orderCounter++,
            pattern: patternString
        });
        expressions[this.guid].previousCall = "match";
        return this;
    };

    JsToRegex.prototype.is = function (patternString) {
        if (!patternString) {
            throw "Argument missing: patternString";
        }
        log("Pattern string passed to is: " + patternString);
        if (!expressions[this.guid].pattern.is) {
            expressions[this.guid].pattern.is = [];
        }

        expressions[this.guid].pattern.is.push({
            order: expressions[this.guid].orderCounter++,
            pattern: patternString
        });
        expressions[this.guid].previousCall = "is";
        return this;
    };

    JsToRegex.prototype.or = function(patternString) {
        return this[expressions[this.guid].previousCall].call(this, patternString);
    };

    // Private functions
    function log(message) {
        if (JsToRegex.DEBUG) {
            console.log(message);
        }
    }

    function buildRegex(patternObject, maxOrder) {
        var pattern = "";

        pattern += buildStartsWithString(patternObject, maxOrder);

        for (var i = 0; i < maxOrder; i++) {
            pattern += buildMatchString(patternObject, i);
            pattern += buildIsString(patternObject, i);
        }

        pattern += buildEndsWithString(patternObject);

        log("buildRegex call generated the pattern: " + pattern);
        return new RegExp(pattern);
    }

    function buildStartsWithString(patternObject) {
        if (!patternObject) {
            throw "Argument missing: patternObject";
        }
        var parts = patternObject.startsWith || [];
        switch (parts.length) {
            case 0:
                return "";
            case 1:
                return "^" + regexEscape(parts[0]);
            default:
                return "^[" + parts.map(regexEscape).join('|') + "]";
        }
    }

    function buildEndsWithString(patternObject) {
        if (!patternObject) {
            throw "Argument missing: patternObject";
        }
        var parts = patternObject.endsWith || [];
        switch (parts.length) {
            case 0:
                return "";
            case 1:
                return regexEscape(parts[0]) + "$";
            default:
                return "[" + parts.map(regexEscape).join('|') + "]$";
        }
    }

    function buildMatchString(patternObject, order) {
        if (!patternObject) {
            throw "Argument missing: patternObject";
        }
        if (typeof order === "undefined") {
            throw "Argument missing: order";
        }

        log("buildMatchString called with order: " + order);
        var allMatchConditions = patternObject.match || [];
        var currentMatchCondition = allMatchConditions.filter(function (x) {
            return x.order === order;
        }).shift();

        if (currentMatchCondition) {
            log("currentMatchCondition: " + JSON.stringify(currentMatchCondition));
            return "(" + patternObject.match[0].pattern + ")";
        } else {
            return "";
        }
    }

    function buildIsString(patternObject, order) {
        if (!patternObject) {
            throw "Argument missing: patternObject";
        }
        if (typeof order === "undefined") {
            throw "Argument missing: order";
        }

        log("buildIsString called with order: " + order);
        var allIsConditions = patternObject.is || [];
        var currentIsCondition = allIsConditions.filter(function (x) {
            return x.order === order;
        }).shift();
        if (currentIsCondition) {
            log("currentIsCondition: " + JSON.stringify(currentIsCondition));
            return regexEscape(currentIsCondition.pattern);
        } else {
            return "";
        }
    }

    function regexEscape(patternString) {
        console.warn("regexEscape is only mocked, it needs to be implemented!");
        return patternString;
    }

    return JsToRegex;
})();


js2r.DEBUG = true;

var x = js2r.create("efilimont")
    .endsWith("s")
    .or("t")
    .getMatch();

alert(x);