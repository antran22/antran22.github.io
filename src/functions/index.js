const CleanCSS = require("clean-css");
const Image = require("./image");
const minifyJS = require("./jsmin");
module.exports = function addFunctions(eleventyConfig) {
  eleventyConfig.addFilter("cssmin", cssMinify);

  eleventyConfig.addFilter("log", log);

  eleventyConfig.addFilter("stringify", stringify);

  eleventyConfig.addFilter("brief", brief);

  eleventyConfig.addAsyncShortcode("Image", Image);

  eleventyConfig.addFilter("escapeHTML", escapeHTML);

  eleventyConfig.addNunjucksAsyncFilter("jsmin", minifyJS);
};

function cssMinify(code) {
  return new CleanCSS({}).minify(code).styles;
}

function escapeHTML(s) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function stringify(value) {
  return JSON.stringify(value);
}

function log(value) {
  console.log("Logging", value);
  return value;
}

function brief(string) {
  const tokens = string.split(" ");
  if (tokens.length > 20) {
    const usedTokens = tokens.slice(0, 20);
    return usedTokens.join(" ") + "...";
  }
  return string;
}
