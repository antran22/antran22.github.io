const CleanCSS = require("clean-css");
const prettyDate = require("pretty-date");
const getSlugFromPost = require("./getSlugFromPost");

module.exports = function addFilters(eleventyConfig) {
  eleventyConfig.addFilter("cssmin", cssMinify);

  eleventyConfig.addFilter("log", log);

  eleventyConfig.addFilter("stringify", stringify);

  eleventyConfig.addFilter("prettyDate", prettyDate.format);

  eleventyConfig.addFilter("getSlugFromPost", require("./getSlugFromPost"));
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
