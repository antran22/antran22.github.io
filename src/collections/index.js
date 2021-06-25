const _ = require("lodash");
const pagedPostsByTag = require("./pagedPostsByTag");
const allPosts = require("./allPosts");

module.exports = function addCollections(eleventyConfig) {
  eleventyConfig.addCollection("allPosts", allPosts);

  eleventyConfig.addCollection("pagedPostsByTag", pagedPostsByTag);

  eleventyConfig.addFilter("omitGeneratedCollections", (tags) => {
    return _.omit(tags, "allPosts", "all", "pagedPostsByTag");
  });
};
