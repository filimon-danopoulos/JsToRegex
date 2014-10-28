var js2r = require("./js2r").js2r;
try {
    js2r.create("test").or("b");
} catch (ex) {
    console.log(ex);
}
