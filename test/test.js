var assert = require("assert");

describe('JsToRegex', function() {
    var js2r = require("../JsToRegex");

    describe('create()', function() {
        it('should return a new instance', function() {
            assert(js2r.create() instanceof js2r);
        });
    });
    describe('ANY', function() {
        it('constant value should be equal to ".*"', function() {
            assert(js2r.ANY === ".*");
        });
    });

    describe('prototype', function() {
        describe('compile()', function() {
            it('should return the compiled regular expression', function() {
                assert(js2r.create().match(js2r.ANY).compile().toString() === "/(.*)/");
            });
        });
        describe('isMatch()', function() {
            it('should return true for a valid match', function() {
                assert(js2r.create("test").is(js2r.ANY).isMatch());
                assert(js2r.create("test").startsWith("t").is(js2r.ANY).endsWith("t").isMatch());
            });
            it('should return false for an invalid match', function() {
                assert(!js2r.create("test").startsWith("a").isMatch());
                assert(!js2r.create("test").is("a").isMatch());
                assert(!js2r.create("test").endsWith("a").isMatch());
            });
            it('should return true when a string starts with a value passed to a "startsWith" call', function() {
                assert(js2r.create("test on thing string").startsWith("test").isMatch());
                assert(js2r.create("on thing string").startsWith("test").or("on").isMatch());
            });
        });
        describe('getMatch()', function() {
            it('should return all matches when the compiled regex matches', function() {
                var result = js2r.create("test").match(js2r.ANY).getMatch();
                assert(result.length === 1);
                assert(result[0] === "test");
            });
            it('should return no matches when the compiled regex does not match', function() {
                var result = js2r.create("test").is(js2r.ANY).match("a").is(js2r.ANY).getMatch();
                assert(result.length === 0);
            });
        });
        describe('startsWith()', function() {
            it('should throw when called without any parameters', function() {
                var threw = false;
                try {
                    js2r.create().startsWith();
                } catch (ex) {
                    threw = true;
                }
                assert(threw);
            });
            it('should add a "startsWith" entry when called with "a"', function() {
                var result = js2r.create().startsWith("a").getConditions();
                assert(result.startsWith);
                assert(result.startsWith.length === 1);
                assert(result.startsWith[0].pattern);
                assert(result.startsWith[0].pattern === "a");
            });
            it('should add two "startsWith" entries when called with "a" then with "b"', function() {
                var result = js2r.create().startsWith("a").startsWith("b").getConditions();
                assert(result.startsWith);
                assert(result.startsWith.length === 2);
                assert(result.startsWith[0].pattern === "a");
                assert(result.startsWith[1].pattern === "b");

            });
            it('should add N "startsWith" entries when called with "a" N times', function() {
                var result = js2r.create(),
                    iMax = Math.ceil(Math.random() * 100);
                for (var i = 0; i < iMax; i++) {
                    result.startsWith("a");
                }
                result = result.getConditions();
                assert(result.startsWith);
                assert(result.startsWith.length === iMax);
                
                for (var i = 0; i < iMax; i++) {
                    assert(result.startsWith[i].pattern === "a");
                }
                
            });
            it('should throw an exception when it\'s not the first condition', function() {
                var threw = false;
                try {
                    js2r.create().match("b").startsWith("a");
                } catch (ex) {
                    threw = true;
                } finally {
                    assert(threw);
                }
            });
            it('should throw an exception when mulitple calls are interupted by other conditions', function() {
                var threw = false;
                try {
                    js2r.create().startsWith("a").match("b").startsWith("c");
                } catch (ex) {
                    threw = true;
                } finally {
                    assert(threw);
                }
            });
        });
        describe('endsWith()', function() {
            it('should throw when called without any parameters', function() {
                var threw = false;
                try {
                    js2r.create().endsWith();
                } catch (ex) {
                    threw = true;
                }
                assert(threw);
            });
            it('should add a "endsWith" entry when called with "a"', function() {
                var result = js2r.create().endsWith("a").getConditions();
                assert(result.endsWith);
                assert(result.endsWith.length === 1);
                assert(result.endsWith[0].pattern === "a");
            });
            it('should add two "endsWith" entries when called with "a" then with "b"', function() {
                var result = js2r.create().endsWith("a").endsWith("b").getConditions();
                assert(result.endsWith);
                assert(result.endsWith.length === 2);
                assert(result.endsWith[0].pattern === "a");
                assert(result.endsWith[1].pattern === "b");
            });
            it('should add N "endsWith" entries when called N times', function() {
                var result = js2r.create(),
                    iMax = Math.floor(Math.random() * 100);
                for (var i = 0; i < iMax; i++) {
                    result.endsWith("a");
                }
                result = result.getConditions();
                assert(result.endsWith);
                assert(result.endsWith.length === iMax);
                for (var i = 0; i < iMax; i++) {
                    assert(result.endsWith[i].pattern === "a");
                }
            });
            it('should throw an exception when multiple calls are interupted by other conditions', function() {
                var threw = false;
                try {
                    js2r.create().endsWith("a").match("b").endsWith("c");
                } catch (ex) {
                    threw = true;
                } finally {
                    assert(threw);
                }
            });
        });
        describe('match()', function() {
            it('should throw when called without any parameters', function() {
                var threw = false;
                try {
                    js2r.create().match();
                } catch (ex) {
                    threw = true;
                }
                assert(threw);
            });
            it('should add a "match" entry when called with "a"', function() {
                var result = js2r.create().match("a").getConditions();
                assert(result.match);
                assert(result.match.length === 1);
                assert(result.match[0].pattern === "a");
            });
        });
        describe('is()', function() {
            it('should throw when called without any parameters', function() {
                var threw = false;
                try {
                    js2r.create().is();
                } catch (ex) {
                    threw = true;
                }
                assert(threw);
            });
            it('should add an "is" entry when called with "a"', function() {
                var result = js2r.create().is("a").getConditions();
                assert(result.is);
                assert(result.is.length === 1);
                assert(result.is[0].pattern === "a");
            });
        });
        describe('flags()', function() {
            it('should throw when called without any parameters', function() {
                var threw = false;
                try {
                    js2r.create().flags();
                } catch (ex) {
                    threw = true;
                }
                assert(threw);
            });
            it('should throw when called with an invalid flag', function() {
                var threw = false;
                try {
                    js2r.create().flags(1);
                } catch (ex) {
                    threw = true;
                }
                assert(threw);
            });
            it('should add the "g" flag when the "js2r.flags.GLOBAL" option is passed', function() {
                assert(js2r.create().is(js2r.ANY).flags(js2r.flags.GLOBAL).compile().global);
            });
            it('should add the "i" flag when the "js2r.flags.IGNORE_CASE" option is passed', function() {
                assert(js2r.create().is(js2r.ANY).flags(js2r.flags.IGNORE_CASE).compile().ignoreCase);
            });
            it('should add the "m" flag when the "js2r.flags.MULTILINE" option is passed', function() {
                assert(js2r.create().is(js2r.ANY).flags(js2r.flags.MULTILINE).compile().multiline);
            });
            it('should add the "g" and "i" flag when the "js2r.flags.GLOBAL" and "js2r.flags.IGNORE_CASE" option are passed', function() {
                var expr = js2r.create()
                    .is(js2r.ANY)
                    .flags(js2r.flags.GLOBAL | js2r.flags.IGNORE_CASE)
                    .compile();
                assert(expr.global && expr.ignoreCase);
            });
            it('should add the "g" and "m" flag when the "js2r.flags.GLOBAL" and "js2r.flags.MULTILINE" option are passed', function() {
                var expr = js2r.create()
                    .is(js2r.ANY)
                    .flags(js2r.flags.GLOBAL | js2r.flags.MULTILINE)
                    .compile();
                assert(expr.global && expr.multiline);
            });
            it('should add the "m" and "i" flag when the "js2r.flags.MULTILINE" and "js2r.flags.IGNORE_CASE" option are passed', function() {
                var expr = js2r.create()
                    .is(js2r.ANY)
                    .flags(js2r.flags.MULTILINE | js2r.flags.IGNORE_CASE)
                    .compile();
                assert(expr.multiline && expr.ignoreCase);
            });
            it('should add the "g","m" and "i" flag when the "js2r.flags.GLOBAL", "js2r.flags.MULTILINE" and "js2r.flags.IGNORE_CASE" option are passed', function() {
                var expr = js2r.create()
                    .is(js2r.ANY)
                    .flags(js2r.flags.GLOBAL | js2r.flags.MULTILINE | js2r.flags.IGNORE_CASE)
                    .compile();
                assert(expr.global && expr.multiline && expr.ignoreCase);
            });
        });
        describe('or()', function() {
            it('should throw when called without any parameters', function() {
                var threw = false;
                try {
                    js2r.create().is("a").or();
                } catch (ex) {
                    threw = true;
                }
                assert(threw);
            });
            it('should throw when called after an un-supported condition', function() {
                var threw = false;
                try {
                    js2r.create().or("a");
                } catch (ex) {
                    threw = true;
                }
                assert(threw);
            });
            it('it should add two "startsWith" entries when called with "b" after ".startsWith(\"a\")"', function() {
                var result = js2r.create().startsWith("a").or("b").getConditions();
                assert(result.startsWith);
                assert(result.startsWith.length === 2);
                assert(result.startsWith[0].pattern === "a");
                assert(result.startsWith[1].pattern === "b");
            });
            it('it should add two "endsWith" entries when called with "b" after ".endsWith(\"a\")"', function() {
                var result = js2r.create().endsWith("a").or("b").getConditions();
                assert(result.endsWith);
                assert(result.endsWith.length === 2);
                assert(result.endsWith[0].pattern === "a");
                assert(result.endsWith[1].pattern === "b");
            });
            it('it should add two "is" entries when called with "b" after ".is(\"a\")"', function() {
                var result = js2r.create().is("a").or("b").getConditions();
                assert(result.is);
                assert(result.is.length === 2);
                assert(result.is[0].pattern === "a");
                assert(result.is[1].pattern === "b");
            });
            it('it should add two "match" entries when called with "b" after ".match(\"a\")"', function() {
                var result = js2r.create().match("a").or("b").getConditions();
                assert(result.match);
                assert(result.match.length === 2);
                assert(result.match[0].pattern === "a");
                assert(result.match[1].pattern === "b");
            });
        });
    });
});

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
                    threw = true;
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
                    threw = true;
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
                    threw = true;
                }
                assert(threw);
            });
            it('should throw an exception when called without an order pattern', function() {
                var threw = false;
                try {
                    builder.buildMatchString("a");
                } catch (ex) {
                    threw = true;
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
            it('should return "(a|b|c)" for multiple "match" conditions with the values "a", "b" and "c"', function() {
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
                    threw = true;
                }
                assert(threw);
            });
            it('should throw an exception when called without an order pattern', function() {
                var threw = false;
                try {
                    builder.buildIsString("a");
                } catch (ex) {
                    threw = true;
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
            it('should return "(?:a|b|c)" for multiple "is" conditions with the values "a", "b" and "c"', function() {
                var expected, input, result;
                expected = "(?:a|b|c)";
                input = { is: [{ order: 0, pattern: "a" },  { order: 0, pattern: "b" },  { order: 0, pattern: "c"}] };
                result = builder.buildIsString(input, 0);
                assert(result === expected, '"'+ result + '" === "' + expected + '"');
            });
        });
        describe('regexEscape()', function() {
            it('should throw an exception when called without a parameter', function() {
                var threw = false;
                try {
                    builder.regexEscape();
                } catch (ex) {
                    threw = true;
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

