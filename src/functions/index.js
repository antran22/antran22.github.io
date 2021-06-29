const CleanCSS = require("clean-css");
const Image = require("./image");

module.exports = function addFunctions(eleventyConfig) {
  eleventyConfig.addFilter("cssmin", cssMinify);

  eleventyConfig.addFilter("log", log);

  eleventyConfig.addFilter("stringify", stringify);

  eleventyConfig.addAsyncShortcode("Image", Image);
};

function cssMinify(code) {
  return new CleanCSS({}).minify(code).styles;
}

function stringify(value) {
  return JSON.stringify(value);
}

function log(value) {
  console.log("Logging", value);
  return value;
}
