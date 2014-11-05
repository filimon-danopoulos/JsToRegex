var js2r = require("./JsToRegex");

var x = js2r.create("https://www.test.com")
    .is("https")
    .is("://")
    .is("www")
    .is(".")
    .match(js2r.ANY)
    .is(".")
    .is("com")
    .getMatch();

console.log(x);
