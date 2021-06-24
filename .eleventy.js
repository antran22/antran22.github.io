const inclusiveLangPlugin = require("@11ty/eleventy-plugin-inclusive-language");
const addFilters = require("./src/functions");
const addTransforms = require("./src/transforms");
const addShortCodes = require("./src/shortCodes");

module.exports = function (eleventyConfig) {
  addPlugins(eleventyConfig);
  addFilters(eleventyConfig);
  addTransforms(eleventyConfig);
  addShortCodes(eleventyConfig);

  eleventyConfig.addCollection("allPosts", (collection) => {
    return collection.getFilteredByGlob("./src/views/posts/*.md").reverse();
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
}
