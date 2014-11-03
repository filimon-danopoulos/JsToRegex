var assert = require("assert"),
    Errors = require("../Errors");
    
describe('RegexBuilder', function() {
    var RegexBuilder = require("../RegexBuilder"),
        builder = new RegexBuilder();
        
    describe('protype', function() {
        describe('buildRegex()', function() {
            it('should compile a JsToRegex object to a regex');
        });
        describe('buildFlagsString()', function() {
            it('should return a string representing flag');
        });
        describe('buildStartsWithString()', function() {
            it('should throw an exception when called without any parameters', function() {
                var threw = false;
                try {
                    builder.buildStartsWithString();
                } catch (ex) {
                    if (ex instanceof Errors.ArgumentMissing) {
                        threw = true;
                    }
                }
                assert(threw);
            });
            it('should return an empty string when no "startsWith" condition is supplied', function() {
                var expected = "", 
                    input  = { }, 
                    result = builder.buildStartsWithString(input, 0);
                assert(result === expected, '"'+ result + '" === "' + expected + '"');
            });
            it('should retrun "^a" for an object with a single "startsWith" condition with value "a"', function() {
                var expected = "^a",
                    input = {
                        startsWith: [{pattern: "a"}]
                    },
                    result = builder.buildStartsWithString(input);
                assert(result === expected, '"' + result + '" === "' + expected + '"');
            });
            it('should return "^(?:a|b)" for an object with two "startsWith" conditions with value "a" and "b"', function() {
                var expected = "^(?:a|b)",
                    input = {
                        startsWith: [{
                            pattern: "a"
                        }, {
                            pattern: "b"
                        }]
                    },
                    result = builder.buildStartsWithString(input);
                assert(result === expected, '"' + result + '" === "' + expected + '"');
            });
        });
        describe('buildEndsWithString()', function() {
            it('should throw an exception when called without any parameters', function() {
                var threw = false;
                try {
                    builder.buildEndsWithString();
                } catch (ex) {
                    if (ex instanceof Errors.ArgumentMissing) {
                        threw = true;
                    }
                }
                assert(threw);
            });
            it('should return an empty string when no "endsWith" condition is supplied', function() {
                var expected = "", 
                    input  = { }, 
                    result = builder.buildEndsWithString(input, 0);
                assert(result === expected, '"'+ result + '" === "' + expected + '"');
            });
            it('should return "a$" for an object with a single "endsWith" condition and value "a"', function() {
                var expected = "a$",
                    input = {
                        endsWith: [{
                            pattern: "a"
                        }]
                    },
                    result = builder.buildEndsWithString(input);
                assert(result === expected, '"'+ result + '" === "' + expected + '"');
            });
            it('should return "(?:a|b)$" for an object with two "endsWith" conditions and values "a" and "b"', function() {
                var expected = "(?:a|b)$",
                    input = {
                        endsWith: [{
                            pattern: "a"
                        }, {
                            pattern: "b"
                        }]
                    },
                    result = builder.buildEndsWithString(input);
                assert(result === expected, '"'+ result + '" === "' + expected + '"');
            });
        });
        describe('buildMatchString()', function() {
            it('should throw an exception when called without any parameters', function() {
                var threw = false;
                try {
                    builder.buildMatchString();
                } catch (ex) {
                    if (ex instanceof Errors.ArgumentMissing) {
                        threw = true;
                    }
                }
                assert(threw);
            });
            it('should throw an exception when called without an order pattern', function() {
                var threw = false;
                try {
                    builder.buildMatchString("a");
                } catch (ex) {
                    if (ex instanceof Errors.ArgumentMissing) {
                        threw = true;
                    }
                }
                assert(threw);
            });
            it('should return an empty string when no "match" condition is supplied', function() {
                var expected = "", 
                    input  = { }, 
                    result = builder.buildMatchString(input, 0);
                assert(result === expected, '"'+ result + '" === "' + expected + '"');
            });
            it('should return "(a)" for a single "match" condition with the value "a".', function() {
                var expected = "(a)", 
                    input  = { match: [{ order: 0,pattern: "a" }] }, 
                    result = builder.buildMatchString(input, 0);
                assert(result === expected, '"'+ result + '" === "' + expected + '"');
            });
            it('should return "(a|b|c)" for multiple "match" conditions with the values "a", "b" and "c" and the same order', function() {
                var expected, input, result;
                expected = "(a|b|c)";
                input = { match: [{ order: 0, pattern: "a" },  { order: 0, pattern: "b" },  { order: 0, pattern: "c"}] };
                result = builder.buildMatchString(input, 0);
                assert(result === expected, '"'+ result + '" === "' + expected + '"');
            });
        });
        describe('buildIsString()', function() {
            it('should throw an exception when called without any parameters', function() {
                var threw = false;
                try {
                    builder.buildIsString();
                } catch (ex) {
                    if (ex instanceof Errors.ArgumentMissing) {
                        threw = true;
                    }
                }
                assert(threw);
            });
            it('should throw an exception when called without an order pattern', function() {
                var threw = false, 
                    input = {
                        is: []
                    };
                try {
                    builder.buildIsString(input);
                } catch (ex) {
                    if (ex instanceof Errors.ArgumentMissing) {
                        threw = true;
                    }
                }
                assert(threw);
            });
            it('should return an empty string when no "is" condition is supplied', function() {
                var expected = "", 
                    input  = { }, 
                    result = builder.buildIsString(input, 0);
                assert(result === expected, '"'+ result + '" === "' + expected + '"');
            });
            it('should return "a" for a single "is" condition with the value "a".', function() {
                var expected = "a", 
                    input  = { is: [{ order: 0,pattern: "a" }] }, 
                    result = builder.buildIsString(input, 0);
                assert(result === expected, '"'+ result + '" === "' + expected + '"');
            });
            it('should return "(?:a|b|c)" for multiple "is" conditions with the values "a", "b" and "c" and the same order', function() {
                var expected, input, result;
                expected = "(?:a|b|c)";
                input = { is: [{ order: 0, pattern: "a" },  { order: 0, pattern: "b" },  { order: 0, pattern: "c"}] };
                result = builder.buildIsString(input, 0);
                assert(result === expected, '"'+ result + '" === "' + expected + '"');
            });
        });
        describe('buildIsAnyAstring()', function() {
            it('should throw an exception when called without any parameters', function() {
                var threw = false;
                try {
                    builder.buildIsAnyString();
                } catch (ex) {
                    if (ex instanceof Errors.ArgumentMissing) {
                        threw = true;
                    }
                }
                assert(threw);
            });
            it('should throw an exception when called without an order parameter', function() {
                var threw = false,
                    input = {
                        isAny: []
                    };
                try {
                    builder.buildIsAnyString(input);
                } catch (ex) {
                    if (ex instanceof Errors.ArgumentMissing) {
                        threw = true;
                    }
                }
                assert(threw);
            });
            it('should return an empty string when no "isAny" condition is supplied', function() {
                var expected = "", 
                    input  = { }, 
                    result = builder.buildIsAnyString(input, 0);
                assert(result === expected, '"'+ result + '" === "' + expected + '"');
            });
            it('should return an empty string when an empty array is supplied as the "isAny" condition', function() {
                var expected = "", 
                    input  = { 
                        isAny: []
                    }, 
                    result = builder.buildIsAnyString(input, 0);
                assert(result === expected, '"'+ result + '" === "' + expected + '"');
            });
            it('should return [abc] for a single "isAny" condition with the value "abc"', function() {
                var expected = "[abc]", 
                    input  = { 
                        isAny: [{
                            pattern: "abc",
                            order: 0
                        }]
                    }, 
                    result = builder.buildIsAnyString(input, 0);
                assert(result === expected, '"'+ result + '" === "' + expected + '"');
            });
            it('should return [abcdef] for two "isAny" conditions with the values "abc" and "def" and the same order', function() {
                var expected = "[abcdef]", 
                    input  = { 
                        isAny: [{
                            pattern: "abc",
                            order: 0
                        }, {
                            pattern: "def",
                            order: 0
                        }]
                    }, 
                    result = builder.buildIsAnyString(input, 0);
                assert(result === expected, '"'+ result + '" === "' + expected + '"');
            });
        });
        describe('regexEscape()', function() {
            it('should throw an exception when called without a parameter', function() {
                var threw = false;
                try {
                    builder.regexEscape();
                } catch (ex) {
                    if (ex instanceof Errors.ArgumentMissing) {
                        threw = true;
                    }
                }
                assert(threw);
            });
            it('should escape "-" to "\\-"', function() {
                var expected = "\\-",
                result = builder.regexEscape("-");
                assert(result === expected, '"'+ result + '" === "' + expected + '"');
            });
            it('should escape "[" to "\\["', function() {
                var expected = "\\[",
                result = builder.regexEscape("[");
                assert(result === expected, '"'+ result + '" === "' + expected + '"');
            });
            it('should escape "{" to "\\{"', function() {
                var expected = "\\{",
                result = builder.regexEscape("{");
                assert(result === expected, expected + " ==.= " + result);
            });
            it('should escape "}" to "\\}"', function() {
                var expected = "\\}",
                result = builder.regexEscape("}");
                assert(result === expected, '"'+ result + '" === "' + expected + '"');
            });
            it('should escape "(" to "\\("', function() {
                var expected = "\\(",
                result = builder.regexEscape("(");
                assert(result === expected, '"'+ result + '" === "' + expected + '"');
            });
            it('should escape ")" to "\\)"', function() {
                var expected = "\\)",
                result = builder.regexEscape(")");
                assert(result === expected, '"'+ result + '" === "' + expected + '"');
            });
            it('should escape "*" to "\\*"', function() {
                var expected = "\\*",
                result = builder.regexEscape("*");
                assert(result === expected, '"'+ result + '" === "' + expected + '"');
            });
            it('should escape "+" to "\\+"', function() {
                var expected = "\\+",
                result = builder.regexEscape("+");
                assert(result === expected, '"'+ result + '" === "' + expected + '"');
            });
            it('should escape "?" to "\\?"', function() {
                var expected = "\\?",
                result = builder.regexEscape("?");
                assert(result === expected, '"'+ result + '" === "' + expected + '"');
            });
            it('should escape "." to "\\."', function() {
                var expected = "\\.",
                result = builder.regexEscape(".");
                assert(result === expected, '"'+ result + '" === "' + expected + '"');
            });
            it('should escape "\\" to "\\\\"', function() {
                var expected = "\\\\",
                    result = builder.regexEscape("\\");
                assert(result === expected, '"'+ result + '" === "' + expected + '"');                
            });
            it('should escape "^" to "\\^"', function() {
                var expected = "\\^",
                    result = builder.regexEscape("^");
                assert(result === expected, '"'+ result + '" === "' + expected + '"');
            });
            it('should escape "$" to "\\$"', function() {
                var expected = "\\$",
                result = builder.regexEscape("$");
                assert(result === expected, '"'+ result + '" === "' + expected + '"');
            });
            it('should escape "|" to "\\|"', function() {
                var expected = "\\|",
                result = builder.regexEscape("|");
                assert(result === expected, '"'+ result + '" === "' + expected + '"');
            });
            it('should escape "#" to "\\#"', function() {
                var expected = "\\#",
                result = builder.regexEscape("#");
                assert(result === expected, '"'+ result + '" === "' + expected + '"');
            });
        });
    });
});

