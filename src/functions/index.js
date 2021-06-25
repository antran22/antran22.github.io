const CleanCSS = require("clean-css");

module.exports = function addFilters(eleventyConfig) {
  eleventyConfig.addFilter("cssmin", cssMinify);

  eleventyConfig.addFilter("log", log);

  eleventyConfig.addFilter("stringify", stringify);
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
