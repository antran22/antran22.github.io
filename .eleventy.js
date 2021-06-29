const inclusiveLangPlugin = require("@11ty/eleventy-plugin-inclusive-language");
const pluginTOC = require('eleventy-plugin-nesting-toc');
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const markdownIt = require('markdown-it');
const markdownItAnchor = require('markdown-it-anchor');

const addFilters = require("./src/functions");
const addTransforms = require("./src/transforms");
const addFunctions = require("./src/functions");
const addCollections = require("./src/collections");

module.exports = function (eleventyConfig) {
  addPlugins(eleventyConfig);
  addFilters(eleventyConfig);
  addTransforms(eleventyConfig);
  addFunctions(eleventyConfig);
  addCollections(eleventyConfig);

  eleventyConfig.setLibrary("md",
    markdownIt({
      html: true,
      linkify: true,
      typographer: true,
    }).use(markdownItAnchor, {})
  );

  eleventyConfig.addPassthroughCopy({
    "./src/views/_includes/fonts": "_static/fonts",
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
  eleventyConfig.addPlugin(pluginTOC,{
    tags: ['h2', 'h3', 'h4'], // Which heading tags are selected (headings must each have an ID attribute)
    ignoredElements: [],  // Elements to ignore when constructing the label for every header (useful for ignoring permalinks, must be selectors)
    wrapper: 'div',       // Element to put around the root `ol`
    wrapperClass: 'toc',  // Class for the element around the root `ol`
    headingText: 'Table of Contents',      // Optional text to show in heading above the wrapper element
    headingTag: 'h2'      // Heading
  });
  eleventyConfig.addPlugin(inclusiveLangPlugin);
  eleventyConfig.addPlugin(syntaxHighlight);
}
