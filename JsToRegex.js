var JsToRegex,
    RegexBuilder;

RegexBuilder = require("./RegexBuilder");    
    
JsToRegex = (function() {
    var expressions = {},
        regexBuilder = new RegexBuilder();

    function JsToRegex() {
        this.guid = Math.floor(Math.random() * 100000000000);
    }

    // Static functions and constants
    JsToRegex.create = function(testString) {
        var newInstance = new JsToRegex();
        expressions[newInstance.guid] = {
            orderCounter: 0,
            testString: testString,
            pattern: {
                startsWith: [],
                endsWith: [],
                is: [],
                match: []
            },
            previousCall: "",
            global: false,
            ignoreCase: false,
            multiline: false
        };
        return newInstance;
    };

    JsToRegex.ANY = ".*";
    JsToRegex.flags = {
        GLOBAL: 2,
        IGNORE_CASE: 4,
        MULTILINE: 8
    };


    // Public methods
    JsToRegex.prototype.isMatch = function() {
        var regex = regexBuilder.buildRegex(expressions[this.guid]),
            testString = expressions[this.guid].testString,
            result = regex.test(testString);
        return result;
    };

    JsToRegex.prototype.getMatch = function() {
        var regex = regexBuilder.buildRegex(expressions[this.guid]),
            testString = expressions[this.guid].testString,
            result = regex.exec(testString);
        if (!result) {
            return [];
        } else {
            return result.slice(1);
        }
    };

    JsToRegex.prototype.compile = function() {
        return regexBuilder.buildRegex(expressions[this.guid]);
    };

    JsToRegex.prototype.startsWith = function(patternString) {
        if (typeof patternString === "undefined") {
            throw "Argument missing: patternString";
        }
        startsWith(this.guid, patternString);
        return this;
    };

    JsToRegex.prototype.endsWith = function(patternString) {
        if (typeof patternString === "undefined") {
            throw "Argument missing: patternString";
        }
        endsWith(this.guid, patternString);
        return this;
    };

    JsToRegex.prototype.is = function(patternString) {
        if (typeof patternString === "undefined") {
            throw "Argument missing: patternString";
        }
        is(this.guid, patternString, false);
        return this;
    };

    JsToRegex.prototype.match = function(patternString) {
        if (typeof patternString === "undefined") {
            throw "Argument missing: patternString";
        }
        match(this.guid, patternString, false);
        return this;
    };

    JsToRegex.prototype.or = function(patternString) {
        if (typeof patternString === "undefined") {
            throw "Invalid argument: patternString";
        }
        switch(expressions[this.guid].previousCall) {
            case "startsWith": startsWith(this.guid, patternString); break;
            case "endsWith": endsWith(this.guid, patternString); break;
            case "match": match(this.guid, patternString, true); break;
            case "is": is(this.guid, patternString, true); break;
            default: throw "Invalid operation: Can't call \"or\" after an invalid condition.";
        }
        return this;
    };

    JsToRegex.prototype.flags = function(flags) {
        if (typeof flags === "undefined") {
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
    
    JsToRegex.prototype.getConditions = function() {
        return expressions[this.guid].pattern;
    }

    function startsWith(guid, patternString) {
        if (Object.keys(expressions[guid].pattern).filter(function(x) {
                return x !== "startsWith" && expressions[guid].pattern[x].length;
            }).shift()) {
            throw "Invalid operation: startsWith can't be called after other conditions are defined";
        }

        expressions[guid].pattern.startsWith.push({
            pattern: patternString
        });
        expressions[guid].previousCall = "startsWith";
    }
    
    function endsWith(guid, patternString) {
        expressions[guid].pattern.endsWith.push(patternString);
        expressions[guid].previousCall = "endsWith";
    }
    
    function is(guid, patternString, calledFromOr) {
        expressions[guid].pattern.is.push({
            order: expressions[guid].orderCounter,
            pattern: patternString
        });
        if (!calledFromOr) {
            ++expressions[guid].orderCounter;
        }
        expressions[guid].previousCall = "is";
    }
    
    function match(guid, patternString, calledFromOr) {  
        expressions[guid].pattern.match.push({
            order: expressions[guid].orderCounter++,
            pattern: patternString
        });
        expressions[guid].previousCall = "match";
    }

    return JsToRegex;
})();

module.exports = JsToRegex;
