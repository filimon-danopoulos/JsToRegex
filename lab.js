var js2r = require("./js2r").js2r;
console.log(js2r.create("test").is(js2r.ANY).flags(js2r.flags.GLOBAL).compile().global);
