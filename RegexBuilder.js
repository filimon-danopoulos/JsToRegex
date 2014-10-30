var RegexBuilder;
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
        if (!patternObject) {
            throw "Argument missing: patternObject";
        }
        var parts = patternObject.startsWith || [];
        switch (parts.length) {
            case 0:
                return "";
            case 1:
                return "^" + this.regexEscape(parts[0]);
            default:
                return "^[" + parts.map(this.regexEscape).join('|') + "]";
        }
    };

    RegexBuilder.prototype.buildEndsWithString = function(patternObject) {
        if (!patternObject) {
            throw "Argument missing: patternObject";
        }
        var parts = patternObject.endsWith || [];
        switch (parts.length) {
            case 0:
                return "";
            case 1:
                return this.regexEscape(parts[0]) + "$";
            default:
                return "[" + parts.map(this.regexEscape).join('|') + "]$";
        }
    };

    RegexBuilder.prototype.buildMatchString = function(patternObject, order) {
        if (!patternObject) {
            throw "Argument missing: patternObject";
        }
        if (typeof order === "undefined") {
            throw "Argument missing: order";
        }

        var allMatchConditions = patternObject.match || [];
        var currentMatchCondition = allMatchConditions.filter(function(x) {
            return x.order === order;
        }).shift();

        if (currentMatchCondition) {
            return "(" + patternObject.match[0].pattern + ")";
        } else {
            return "";
        }
    };

    RegexBuilder.prototype.buildIsString = function(patternObject, order) {
        if (!patternObject) {
            throw "Argument missing: patternObject";
        }
        if (typeof order === "undefined") {
            throw "Argument missing: order";
        }

        var allIsConditions = patternObject.is || [];
        var currentIsCondition = allIsConditions.filter(function(x) {
            return x.order === order;
        }).map(function(x) {
            return x.pattern;
        });
        if (currentIsCondition.length) {
            if (currentIsCondition.length === 1) {
                return currentIsCondition.shift();
            } else {
                return "["+currentIsCondition.join('|')+"]";
            }
        } else {
            return "";
        }
    };
    
    RegexBuilder.prototype.regexEscape = function(patternString) {
        return patternString.replace(/[-[\]{}()*+?.\\^$|#]/g, "\\$&");
    };
    
    
    return RegexBuilder;
})();

module.exports = RegexBuilder;
