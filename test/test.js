var assert = require("assert");

describe('JsToRegex', function(){
    var js2r = require("../js2r").js2r;
        
    describe('create()', function(){
        it('should return a new instance.', function(){
            assert(js2r.create() instanceof js2r);
        });
    });
    describe('ANY', function() {
        it('constant value should be equal to ".*".', function() {
            assert(js2r.ANY === ".*");
        });
    });
    
    describe('prototype', function() {
        describe('compile()', function() {
            it ('should return the compiled regular expression', function() {
                var expected = '/(.*)/',
                    result = js2r.create().match(js2r.ANY).compile().toString();
                assert(result === expected);
            });
        });
    
        describe('startsWith()', function() {
            it('should result in "^a" when once called with "a".', function() {
                var expected = '/^a/',
                    result = js2r.create()
                        .startsWith("a")
                        .compile()
                        .toString();
                    
                assert(result === expected);
            });
            it('should result in "^[a|b]" when called first with "a" then with "b".', function() {
                var expected = '/^[a|b]/',
                    result = js2r.create()
                        .startsWith("a")
                        .startsWith("b")
                        .compile()
                        .toString();
                assert(result === expected);
            });
            it('should result in "^[p1|...|pn]" when called multiple times.', function() {
                var expected = '/^[a',
                    result = js2r.create()
                        .startsWith("a");
                    
                for (var i = 0; i < Math.floor(Math.random()*1000); i++) {
                    expected += '|a'; 
                    result.startsWith("a");
                }
                expected += ']/';    
                    
                result = result.compile()
                    .toString();
                
                assert(result === expected);                
            });
            it('should throw an exception when it\'s not the first condition.', function() {
                var threw = false;
                try {
                    js2r.create()
                        .match("b")
                        .startsWith("a");
                } catch (ex) {
                    threw = true;
                } finally {
                    assert(threw);  
                }
            });
            it('should throw an exception when mulitple calls are interupted by other conditions', function() {
                var threw = false;
                try {
                    js2r.create()
                        .startsWith("a")
                        .match("b")
                        .startsWith("c");
                } catch (ex) {
                    threw = true;
                } finally {
                    assert(threw);  
                }
            });
        });
        describe('endsWith()', function() {
            it('should result in "a$" if it is called with "a".', function() {
                var expected = "/a$/",
                    result = js2r.create()
                        .endsWith("a")
                        .compile()
                        .toString();
                assert(result === expected);
            });          
            it('should result in "[a|b]$" when called first with "a" then with "b".', function() {
                var expected = '/[a|b]$/',
                    result = js2r.create()
                        .endsWith("a")
                        .endsWith("b")
                        .compile()
                        .toString();
                assert(result === expected);
            });  
            it('should result in "[p1|...|pn]$" when called multiple times.', function() {
                var expected = '/[a',
                    result = js2r.create()
                        .endsWith("a");
                    
                for (var i = 0; i < Math.floor(Math.random()*1000); i++) {
                    expected += '|a'; 
                    result.endsWith("a");
                }
                expected += ']$/';    
                    
                result = result.compile()
                    .toString();
                
                assert(result === expected);                
            });
            it('should throw an exception when multiple calls are interupted by other conditions.', function() {
                var threw = false;
                try {
                    js2r.create()
                        .endsWith("a")
                        .match("b")
                        .endsWith("c");
                } catch (ex) {
                    threw = true;
                } finally {
                    assert(threw);  
                }
            });
        });
    });
});
