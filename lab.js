var js2r = require("./js2r").js2r;
console.log(js2r.create("test").startsWith("a").or("b").compile().toString());
