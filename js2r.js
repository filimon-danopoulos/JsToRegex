var js2r;
js2r = (function() {
    var expressions = {},
        validPreviousCalls = ["startsWith", "endsWith", "is", "match"];


    function JsToRegex() {
        this.guid = Math.floor(Math.random() * 100000000);
    }

    // Static functions and constants
    JsToRegex.create = function(testString) {
        var newInstance = new JsToRegex();
        expressions[newInstance.guid] = {
            orderCounter: 0,
            testString: testString,
            pattern: {},
            previousCall: "",
            global: false,
            ignoreCase: false,
            multiline: false
        };
        return newInstance;
    };

    JsToRegex.DEBUG = false;
    JsToRegex.ANY = ".*";
    JsToRegex.flags = {
        GLOBAL: 2,
        IGNORE_CASE: 4,
        MULTILINE: 8
    };


    // Public methods
    JsToRegex.prototype.isMatch = function() {
        var regex = buildRegex(expressions[this.guid]),
            testString = expressions[this.guid].testString,
            result = regex.test(testString);
        log("isMatch called with the test string: " + testString);
        log("Result of isMatch call: " + result.toString());
        return result;
    };

    JsToRegex.prototype.getMatch = function() {
        var regex = buildRegex(expressions[this.guid]),
            testString = expressions[this.guid].testString,
            result = regex.exec(testString);
        log("getMatch is called with the test string: " + testString);
        if (!result) {
            return [];
        } else {
            log("Result of getMatch call has length: " + result.length);
            return result.slice(1);
        }
    };

    JsToRegex.prototype.compile = function() {
        return buildRegex(expressions[this.guid]);
    };

    JsToRegex.prototype.startsWith = function(patternString) {
        if (!patternString) {
            throw "Argument missing: patternString";
        }
        log("Pattern string passed to startsWith: " + patternString);
        if (!expressions[this.guid].pattern.startsWith) {
            expressions[this.guid].pattern.startsWith = [];
        }
        startsWith(this.guid, patternString);
        return this;
    };

    JsToRegex.prototype.endsWith = function(patternString) {
        if (!patternString) {
            throw "Argument missing: patternString";
        }
        log("Pattern string passed to endsWith: " + patternString);
        if (!expressions[this.guid].pattern.endsWith) {
            expressions[this.guid].pattern.endsWith = [];
        }
        endsWith(this.guid, patternString);
        return this;
    };

    JsToRegex.prototype.match = function(patternString) {
        if (!patternString) {
            throw "Argument missing: patternString";
        }
        log("Pattern string passed to match: " + patternString);
        if (!expressions[this.guid].pattern.match) {
            expressions[this.guid].pattern.match = [];
        }
        match(this.guid, patternString, false);
        return this;
    };

    JsToRegex.prototype.is = function(patternString) {
        if (!patternString) {
            throw "Argument missing: patternString";
        }
        log("Pattern string passed to is: " + patternString);
        if (!expressions[this.guid].pattern.is) {
            expressions[this.guid].pattern.is = [];
        }
        is(this.guid, patternString, false);
        return this;
    };

    JsToRegex.prototype.or = function(patternString) {
        if (!patternString) {
            throw "Invalid argument: patternString";
        }
        if (validPreviousCalls.indexOf(expressions[this.guid].previousCall) === -1) {
            throw "Invalid operation: Can't call \"or\" after an invalid condition.";
        }
        return this[expressions[this.guid].previousCall].call(this, patternString, true);
    };

    JsToRegex.prototype.flags = function(flags) {
        if (!flags) {
            throw "Argument missing: flags";
        }
        switch (flags) {
            case 2:
                expressions[this.guid].global = true;
                break;
            case 4:
                expressions[this.guid].ignoreCase = true;
                break;
            case 6:
                expressions[this.guid].global = true;
                expressions[this.guid].ignoreCase = true;
                break;
            case 8:
                expressions[this.guid].multiline = true;
                break;
            case 10:
                expressions[this.guid].global = true;
                expressions[this.guid].multiline = true;
                break;
            case 12:
                expressions[this.guid].ignoreCase = true;
                expressions[this.guid].multiline = true;
                break;
            case 14:
                expressions[this.guid].global = true;
                expressions[this.guid].ignoreCase = true;
                expressions[this.guid].multiline = true;
                break;
            default:
                throw "Invalid flag option: " + flags;
        }
        return this;
    };

    // Private functions
    function log(message) {
        if (JsToRegex.DEBUG) {
            console.log(message);
        }
    }

    function buildRegex(conditions) {
        var patternObject = conditions.pattern,
            maxOrder = conditions.orderCounter,
            pattern = "";

        pattern += buildStartsWithString(patternObject, maxOrder);

        for (var i = 0; i < maxOrder; i++) {
            pattern += buildMatchString(patternObject, i);
            pattern += buildIsString(patternObject, i);
        }

        pattern += buildEndsWithString(patternObject);

        log("buildRegex call generated the pattern: " + pattern);
        return new RegExp(pattern, buildFlagsString(conditions));
    }

    function buildFlagsString(patternObject) {
        var result = "";
        if (patternObject.global) {
            result += "g";
        }
        if (patternObject.ignoreCase) {
            result += "i";
        }
        if (patternObject.multiline) {
            result += "m";
        }
        return result || undefined;
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
        var currentMatchCondition = allMatchConditions.filter(function(x) {
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
        var currentIsCondition = allIsConditions.filter(function(x) {
            return x.order === order;
        }).shift();
        if (currentIsCondition) {
            log("currentIsCondition: " + JSON.stringify(currentIsCondition));
            return currentIsCondition.pattern;
        } else {
            return "";
        }
    }

    function regexEscape(patternString) {
        return patternString.replace(/[-[\]{}()*+?.\\^$|#]/g, "\\$&");
    }
    
    function startsWith(guid, patternString) {
        if (Object.keys(expressions[guid].pattern).filter(function(x) {
                return x !== "startsWith";
            }).shift()) {
            throw "Invalid operation: startsWith can't be called after other conditions are defined";
        }

        expressions[guid].pattern.startsWith.push(patternString);
        expressions[guid].previousCall = "startsWith";
    }
    
    function endsWith(guid, patternString) {
        expressions[guid].pattern.endsWith.push(patternString);
        expressions[guid].previousCall = "endsWith";
    }
    
    function match(guid, patternString, calledFromOr) {    
        expressions[guid].pattern.match.push({
            order: expressions[guid].orderCounter++,
            pattern: patternString
        });
        expressions[guid].previousCall = "match";
    }
    
    function is(guid, patternString, calledFromOr) {
        expressions[guid].pattern.is.push({
            order: expressions[guid].orderCounter++,
            pattern: patternString
        });
        expressions[guid].previousCall = "is";
    }

    return JsToRegex;
})();

module.exports.js2r = js2r;
