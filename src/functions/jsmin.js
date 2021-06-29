const { minify } = require("terser");
module.exports = async function minifyJS(code, callback) {
  try {
    const minified = await minify(code);
    callback(null, minified.code);
  } catch (err) {
    console.error("Terser error: ", err);
    callback(null, code);
  }
}
