const inclusiveLangPlugin = require("@11ty/eleventy-plugin-inclusive-language");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");

const addFilters = require("./src/functions");
const addTransforms = require("./src/transforms");
const addShortCodes = require("./src/shortCodes");
const addCollections = require("./src/collections");

module.exports = function (eleventyConfig) {
  addPlugins(eleventyConfig);
  addFilters(eleventyConfig);
  addTransforms(eleventyConfig);
  addShortCodes(eleventyConfig);
  addCollections(eleventyConfig);

  eleventyConfig.addPassthroughCopy({
    "./src/views/_includes/css": "_static/css",
    "./src/views/_includes/js": "_static/js",
  });

  return {
    markdownTemplateEngine: "njk",
    templateFormats: ["md", "njk", "html"],
    dir: {
      input: "src/views",
      includes: "_includes",
      layouts: "_layouts",
      data: "_data",
    },
  };
};

function addPlugins(eleventyConfig) {
  eleventyConfig.addPlugin(inclusiveLangPlugin);
  eleventyConfig.addPlugin(syntaxHighlight);
}
