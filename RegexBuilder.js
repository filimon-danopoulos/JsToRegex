var RegexBuilder, Errors;
Errors = require("./Errors");


RegexBuilder = (function() {
    function RegexBuilder() {
    
    }
    
    RegexBuilder.prototype.buildRegex = function(conditions) {
        var patternObject = conditions.pattern,
            maxOrder = conditions.orderCounter,
            pattern = "";

        pattern += this.buildStartsWithString(patternObject, maxOrder);
        
        for (var i = 0; i < maxOrder; i++) {
            pattern += this.buildMatchString(patternObject, i);
            pattern += this.buildIsString(patternObject, i);
        }

        pattern += this.buildEndsWithString(patternObject);
        return new RegExp(pattern, this.buildFlagsString(conditions));
    };

    RegexBuilder.prototype.buildFlagsString = function(patternObject) {
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
    };

    RegexBuilder.prototype.buildStartsWithString = function(patternObject) {
        if (typeof patternObject === "undefined") {
            throw new Errors.ArgumentMissing("patternObject");
        }
        if (typeof patternObject.startsWith == "undefined") {
            return "";
        }
        
        var parts = patternObject.startsWith;
        switch (parts.length) {
            case 0:
                return "";
            case 1:
                return "^" + this.regexEscape(parts[0].pattern);
            default:
                return "^(?:" + parts.map(function(x) { 
                    return this.regexEscape(x.pattern);
                }, this).join('|') + ")";
        }
    };

    RegexBuilder.prototype.buildEndsWithString = function(patternObject) {
        if (typeof patternObject === "undefined") {
            throw new Errors.ArgumentMissing("patternObject");
        }
        if (typeof patternObject.endsWith === "undefined") {
            return "";
        }
        switch (patternObject.endsWith.length) {
            case 0:
                return "";
            case 1:
                return this.regexEscape(patternObject.endsWith[0].pattern) + "$";
            default:
                return "(?:" + patternObject.endsWith.map(function(x) {
                    return this.regexEscape(x.pattern);
                }, this).join('|') + ")$";
        }
    };

    RegexBuilder.prototype.buildMatchString = function(patternObject, order) {
        if (typeof patternObject === "undefined") {
            throw new Errors.ArgumentMissing("patternObject");
        }
        if (typeof order === "undefined") {
            throw new Errors.ArgumentMissing("order");
        }
        if (typeof patternObject.match === "undefined") {
            return "";
        }
        
        var allMatchConditions = patternObject.match;
        var currentMatchConditions = allMatchConditions.filter(function(x) {
            return x.order === order;
        }).map(function(x) {
            return x.pattern;
        });

        if (currentMatchConditions.length) {
            if (currentMatchConditions.length === 1) {
                return "(" + currentMatchConditions.shift() + ")";
            } else {
                return "(" + currentMatchConditions.join('|') + ")";
            }
        } else {
            return "";
        }
    };

    RegexBuilder.prototype.buildIsString = function(patternObject, order) {
        if (typeof patternObject === "undefined") {
            throw new Errors.ArgumentMissing("patternObject");
        }
        if (typeof order === "undefined") {
            throw new Errors.ArgumentMissing("order");
        }
        if (typeof patternObject.is === "undefined") {
            return "";
        }

        var currentIsCondition = patternObject.is.filter(function(x) {
            return x.order === order;
        }).map(function(x) {
            return x.pattern;
        });
        if (currentIsCondition.length) {
            if (currentIsCondition.length === 1) {
                return currentIsCondition.shift();
            } else {
                return "(?:"+currentIsCondition.join('|')+")";
            }
        } else {
            return "";
        }
    };
    
    RegexBuilder.prototype.buildIsAnyString = function(patternObject, order) {
        if (typeof patternObject === "undefined") {
            throw new Errors.ArgumentMissing("patternObject");
        }
        if (typeof order === "undefined") {
            throw new Errors.ArgumentMissing("order");
        }
        if (typeof patternObject.is === "undefined") {
            return "";
        }
        var currentIsAnyCondition = patternObject.isAny.filter(function(x) {
            return x.order === order;
        }).map(function(x) {
            return x.pattern;
        });
        if (currentIsAnyCondition.length) {
            if (currentIsAnyCondition.length === 1) {
                return "[" + currentIsAnyCondition.shift() + "]";
            } else {
                return "[" + currentIsAnyCondition.join('') + "]"
            }
        } else {
            return "";
        }
    };
    
    RegexBuilder.prototype.regexEscape = function(patternString) {
        if (typeof patternString === "undefined") {
            throw new Errors.ArgumentMissing("patternObject");
        }
        return patternString.replace(/[-[\]{}()*+?.\\^$|#]/g, "\\$&");
    };
    
    
    return RegexBuilder;
})();

module.exports = RegexBuilder;
