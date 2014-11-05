var js2r = require("./JsToRegex");

var x = js2r.create("https://www.test.com")
    .is("https")
    .is("://")
    .match(js2r.ANY)
    .is(".")
    .is(js2r.ANY)
    .getMatch();

console.log(x);
