var assert = require("assert"),
    Errors = require("../Errors");

describe('JsToRegex', function() {
    var js2r = require("../JsToRegex");

    describe('ANY', function() {
        it('constant value should be equal to ".*"', function() {
            assert(js2r.ANY === ".*");
        });
    });

    describe('prototype', function() {
        describe('target()', function() {
            it('should return a new instance', function() {
                assert(js2r().target("test") instanceof js2r);
            });
            it('should add a test string to the JsToRegex object', function() {
                assert(js2r().target("test").is("test").isMatch());
            });
        });
        describe('compile()', function() {
            it('should return the compiled regular expression', function() {
                var result = js2r().match(js2r.ANY).compile().toString();
                assert(result === "/(.*)/");
            });
        });
        describe('isMatch()', function() {
            it('should return true for a valid match', function() {
                assert(js2r().target("test").is(js2r.ANY).isMatch());
                assert(js2r().target("test").startsWith("t").is(js2r.ANY).endsWith("t").isMatch());
            });
            it('should return false for an invalid match', function() {
                assert(!js2r().target("test").startsWith("a").isMatch());
                assert(!js2r().target("test").is("a").isMatch());
                assert(!js2r().target("test").endsWith("a").isMatch());
            });
            it('should return true when a string starts with a value passed to a "startsWith" call', function() {
                assert(js2r().target("test on thing string").startsWith("test").isMatch());
                assert(js2r().target("on thing string").startsWith("test").or("on").isMatch());
            });
        });
        describe('getMatch()', function() {
            it('should return all matches when the compiled regex matches', function() {
                var result = js2r().target("test").match(js2r.ANY).getMatch();
                assert(result.length === 1);
                assert(result[0] === "test");
            });
            it('should return no matches when the compiled regex does not match', function() {
                var result = js2r().target("test").is(js2r.ANY).match("a").is(js2r.ANY).getMatch();
                assert(result.length === 0);
            });
        });
        describe('startsWith()', function() {
            it('should return an instance of JsToRegex', function() {
                var result = js2r().startsWith("a");
                assert(result instanceof js2r);
            });
            it('should throw when called without any parameters', function() {
                var threw = false;
                try {
                    js2r().startsWith();
                } catch (ex) {
                    if (ex instanceof Errors.ArgumentMissing) {
                        threw = true;
                    }
                }
                assert(threw);
            });
            it('should add a "startsWith" entry when called with "a"', function() {
                var result = js2r().startsWith("a").getConditions();
                assert(result.startsWith);
                assert(result.startsWith.length === 1);
                assert(result.startsWith[0].pattern);
                assert(result.startsWith[0].pattern === "a");
            });
            it('should add two "startsWith" entries when called with "a" then with "b"', function() {
                var result = js2r().startsWith("a").startsWith("b").getConditions();
                assert(result.startsWith);
                assert(result.startsWith.length === 2);
                assert(result.startsWith[0].pattern === "a");
                assert(result.startsWith[1].pattern === "b");

            });
            it('should add N "startsWith" entries when called with "a" N times', function() {
                var result = js2r(),
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
                    js2r().match("b").startsWith("a");
                } catch (ex) {
                    if (ex instanceof Errors.InvalidOperation) {
                        threw = true;
                    }
                }
                assert(threw);
            });
            it('should throw an exception when mulitple calls are interupted by other conditions', function() {
                var threw = false;
                try {
                    js2r().startsWith("a").match("b").startsWith("c");
                } catch (ex) {
                    if (ex instanceof Errors.InvalidOperation) {
                        threw = true;
                    }
                }
                assert(threw);
            });
        });
        describe('endsWith()', function() {
            it('should return an instance of JsToRegex', function() {
                var result = js2r().endsWith("a");
                assert(result instanceof js2r);
            });
            it('should throw when called without any parameters', function() {
                var threw = false;
                try {
                    js2r().endsWith();
                } catch (ex) {
                    if (ex instanceof Errors.ArgumentMissing) {
                        threw = true;
                    }
                }
                assert(threw);
            });
            it('should add a "endsWith" entry when called with "a"', function() {
                var result = js2r().endsWith("a").getConditions();
                assert(result.endsWith);
                assert(result.endsWith.length === 1);
                assert(result.endsWith[0].pattern === "a");
            });
            it('should add two "endsWith" entries when called with "a" then with "b"', function() {
                var result = js2r().endsWith("a").endsWith("b").getConditions();
                assert(result.endsWith);
                assert(result.endsWith.length === 2);
                assert(result.endsWith[0].pattern === "a");
                assert(result.endsWith[1].pattern === "b");
            });
            it('should add N "endsWith" entries when called N times', function() {
                var result = js2r(),
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
                    js2r().endsWith("a").match("b").endsWith("c");
                } catch (ex) {
                    if (ex instanceof Errors.InvalidOperation) {
                        threw = true;
                    }
                }
                assert(threw);
            });
        });
        describe('match()', function() {
            it('should return an instance of JsToRegex', function() {
                var result = js2r().match("a");
                assert(result instanceof js2r);
            });
            it('should throw when called without any parameters', function() {
                var threw = false;
                try {
                    js2r().match();
                } catch (ex) {
                    if (ex instanceof Errors.ArgumentMissing) {
                        threw = true;
                    }
                }
                assert(threw);
            });
            it('should add a "match" entry when called with "a"', function() {
                var result = js2r().match("a").getConditions();
                assert(result.match);
                assert(result.match.length === 1);
                assert(result.match[0].pattern === "a");
                assert(result.match[0].order === 0);
            });
        });
        describe('is()', function() {
            it('should return an instance of JsToRegex', function() {
                var result = js2r().is("a");
                assert(result instanceof js2r);
            });
            it('should throw when called without any parameters', function() {
                var threw = false;
                try {
                    js2r().is();
                } catch (ex) {
                    if (ex instanceof Errors.ArgumentMissing) {
                        threw = true;
                    }
                }
                assert(threw);
            });
            it('should add an "is" entry when called with "a"', function() {
                var result = js2r().is("a").getConditions();
                assert(result.is);
                assert(result.is.length === 1);
                assert(result.is[0].pattern === "a");
                assert(result.is[0].order === 0);
            });
        });
        describe('isAny()', function() {
            it('should return an instance of JsToRegex', function() {
                var result = js2r().isAny("a");
                assert(result instanceof js2r);
            });
            it('should throw when called without any parameters', function() {
                var threw = false;
                try {
                    js2r().isAny();
                } catch (ex) {
                    if (ex instanceof Errors.ArgumentMissing) {
                        threw = true;
                    }
                }
                assert(threw);
            });
            it('should add an "isAny" entry when called with "abc"', function() {
                var result = js2r().isAny("abc").getConditions();
                assert(result.isAny);
                assert(result.isAny.length === 1);
                assert(result.isAny[0].pattern === "abc");
                assert(result.isAny[0].order === 0);
            });
        });
        describe('isNone()', function() {
            it('should return an instance of JsToRegex'/*, function() {
                var result = js2r().isNone("a");
                assert(result instanceof js2r);
            }*/);
            it('should throw when called without any parameters'/*, function() {
                var threw = false;
                try {
                    js2r().isNone();
                } catch(ex) {
                    if (ex instanceof Errors.ArgumentMissing) {
                        threw = true;
                    }
                }
                assert(threw);
            }*/);
            it('should add an "isNone" entry when called with "a"'/*, function() {
                var result = js2r().isNone("a").getConditions();
                assert(result.isNone);
                assert(result.isNone.length === 1);
                assert(result.isNone[0].pattern === "a");
                assert(result.isNone[0].order === 0);
            }*/);
        });
        describe('flags()', function() {
            it('should return an instance of JsToRegex', function() {
                var result = js2r().flags(js2r.flags.GLOBAL);
                assert(result instanceof js2r);
            });
            it('should throw when called without any parameters', function() {
                var threw = false;
                try {
                    js2r().flags();
                } catch (ex) {
                    if (ex instanceof Errors.ArgumentMissing) {
                        threw = true;
                    }
                }
                assert(threw);
            });
            it('should throw when called with an invalid flag', function() {
                var threw = false;
                try {
                    js2r().flags(1);
                } catch (ex) {
                    if (ex instanceof Errors.InvalidOperation) {
                        threw = true;
                    }
                }
                assert(threw);
            });
            it('should add the "g" flag when the "js2r.flags.GLOBAL" option is passed', function() {
                assert(js2r().is(js2r.ANY).flags(js2r.flags.GLOBAL).compile().global);
            });
            it('should add the "i" flag when the "js2r.flags.IGNORE_CASE" option is passed', function() {
                assert(js2r().is(js2r.ANY).flags(js2r.flags.IGNORE_CASE).compile().ignoreCase);
            });
            it('should add the "m" flag when the "js2r.flags.MULTILINE" option is passed', function() {
                assert(js2r().is(js2r.ANY).flags(js2r.flags.MULTILINE).compile().multiline);
            });
            it('should add the "g" and "i" flag when the "js2r.flags.GLOBAL" and "js2r.flags.IGNORE_CASE" option are passed', function() {
                var expr = js2r()
                    .is(js2r.ANY)
                    .flags(js2r.flags.GLOBAL | js2r.flags.IGNORE_CASE)
                    .compile();
                assert(expr.global && expr.ignoreCase);
            });
            it('should add the "g" and "m" flag when the "js2r.flags.GLOBAL" and "js2r.flags.MULTILINE" option are passed', function() {
                var expr = js2r()
                    .is(js2r.ANY)
                    .flags(js2r.flags.GLOBAL | js2r.flags.MULTILINE)
                    .compile();
                assert(expr.global && expr.multiline);
            });
            it('should add the "m" and "i" flag when the "js2r.flags.MULTILINE" and "js2r.flags.IGNORE_CASE" option are passed', function() {
                var expr = js2r()
                    .is(js2r.ANY)
                    .flags(js2r.flags.MULTILINE | js2r.flags.IGNORE_CASE)
                    .compile();
                assert(expr.multiline && expr.ignoreCase);
            });
            it('should add the "g","m" and "i" flag when the "js2r.flags.GLOBAL", "js2r.flags.MULTILINE" and "js2r.flags.IGNORE_CASE" option are passed', function() {
                var expr = js2r()
                    .is(js2r.ANY)
                    .flags(js2r.flags.GLOBAL | js2r.flags.MULTILINE | js2r.flags.IGNORE_CASE)
                    .compile();
                assert(expr.global && expr.multiline && expr.ignoreCase);
            });
        });
        describe('or()', function() {
            it('should return an instance of JsToRegex', function() {
                var result = js2r().startsWith("a").or("b");
                assert(result instanceof js2r);
            });
            it('should throw when called without any parameters', function() {
                var threw = false;
                try {
                    js2r().is("a").or();
                } catch (ex) {
                    if (ex instanceof Errors.ArgumentMissing) {
                        threw = true;
                    }
                }
                assert(threw);
            });
            it('should throw when called after an un-supported condition', function() {
                var threw = false;
                try {
                    js2r().or("a");
                } catch (ex) {
                    if (ex instanceof Errors.InvalidOperation) {
                        threw = true;
                    }
                }
                assert(threw);
            });
            it('should add two "startsWith" entries when called with "b" after ".startsWith(\"a\")"', function() {
                var result = js2r().startsWith("a").or("b").getConditions();
                assert(result.startsWith);
                assert(result.startsWith.length === 2);
                assert(result.startsWith[0].pattern === "a");
                assert(result.startsWith[1].pattern === "b");
            });
            it('should add two "endsWith" entries when called with "b" after ".endsWith(\"a\")"', function() {
                var result = js2r().endsWith("a").or("b").getConditions();
                assert(result.endsWith);
                assert(result.endsWith.length === 2);
                assert(result.endsWith[0].pattern === "a");
                assert(result.endsWith[1].pattern === "b");
            });
            it('should add two "is" entries when called with "b" after ".is("a")"', function() {
                var result = js2r().is("a").or("b").getConditions();
                assert(result.is);
                assert(result.is.length === 2);
                assert(result.is[0].pattern === "a");
                assert(result.is[0].order === 0);
                assert(result.is[1].pattern === "b");
                assert(result.is[1].order === 0);
            });
            it('should add two "isAny" entries when called with "b" after ".isAny("a")"', function() {
                var result = js2r().isAny("a").or("b").getConditions();
                assert(result.isAny);
                assert(result.isAny.length === 2);
                assert(result.isAny[0].pattern === "a");
                assert(result.isAny[0].order === 0);
                assert(result.isAny[1].pattern === "b");
                assert(result.isAny[1].order === 0);
            });
            it('should add two "match" entries when called with "b" after ".match(\"a\")"', function() {
                var result = js2r().match("a").or("b").getConditions();
                assert(result.match);
                assert(result.match.length === 2);
                assert(result.match[0].pattern === "a");
                assert(result.match[0].order === 0);
                assert(result.match[1].pattern === "b");
                assert(result.match[1].order === 0);
            });
        });
    });
});
