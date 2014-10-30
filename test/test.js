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
                assert(js2r.create("test").startsWith("t").is(js2r.ANY).endsWith("t"));
            });
            it('should return false for an invalid match', function() {
                assert(js2r.create("test").startsWith("a"));
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
            it('should result in "^a" when once called with "a"', function() {
                var expected = '/^a/',
                    result = js2r.create().startsWith("a").compile().toString();
                assert(result === expected, expected + " === " + result);
            });
            it('should result in "^[a|b]" when called first with "a" then with "b"', function() {
                var expected = '/^[a|b]/',
                    result = js2r.create().startsWith("a").startsWith("b").compile().toString();
                assert(result === expected, expected + " === " + result);
            });
            it('should result in "^[p1|...|pn]" when called multiple times', function() {
                var expected = '/^[a',
                    result = js2r.create().startsWith("a");

                for (var i = 0; i < Math.ceil(Math.random() * 100); i++) {
                    expected += '|a';
                    result.startsWith("a");
                }
                expected += ']/';
                result = result.compile().toString();
                assert(result === expected, expected + " === " + result);
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
            it('should result in "a$" if it is called with "a"', function() {
                var expected = "/a$/",
                    result = js2r.create().endsWith("a").compile().toString();
                assert(result === expected, expected + " === " + result);
            });
            it('should result in "[a|b]$" when called first with "a" then with "b"', function() {
                var expected = '/[a|b]$/',
                    result = js2r.create().endsWith("a").endsWith("b").compile().toString();
                assert(result === expected, expected + " === " + result);
            });
            it('should result in "[p1|...|pn]$" when called multiple times', function() {
                var expected = '/[a',
                    result = js2r.create().endsWith("a");
                for (var i = 0; i < Math.floor(Math.random() * 1000); i++) {
                    expected += '|a';
                    result.endsWith("a");
                }
                expected += ']$/';

                result = result.compile().toString();
                assert(result === expected, expected + " === " + result);
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
            it('should result in "(a)" when called with "a"', function() {
                var expected = "/(a)/",
                    result = js2r.create().match("a").compile().toString();
                assert(result === expected, expected + " === " + result);
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
            it('should result in "a" when called with "a"', function() {
                var expected = "/a/",
                    result = js2r.create().is("a").compile().toString();
                assert(result === expected, expected + " === " + result);
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
            it('it should result in "^[a|b]" when called with "b" after ".startsWith(\"a\")"', function() {
                var expected = "/^[a|b]/",
                    result = js2r.create().startsWith("a").or("b").compile().toString();
                assert(result === expected, expected + " === " + result);
            });
            it('it should result in "[a|b]$" when called with "b" after ".endsWith(\"a\")"', function() {
                var expected = "/[a|b]$/",
                    result = js2r.create().endsWith("a").or("b").compile().toString();
                assert(result === expected, expected + " === " + result);
            });
            it('it should result in "[a|b]" when called with "b" after ".is(\"a\")"', function() {
                var expected = "/[a|b]/",
                    result = js2r.create().is("a").or("b").compile().toString();
                assert(result === expected, expected + " === " + result);
            });
            it('it should result in "([a|b])" when called with "b" after ".match(\"a\")"', function() {
                var expected = "/([a|b])/",
                    result = js2r.create().match("a").or("b").compile().toString();
                assert(result === expected, expected + " === " + result);
            });
        });
    });
});
