const postList = require("./postList");
const paginatedNavigation = require("./paginatedNavigation");
const { postTag, postTagLink } = require("./postTag");

module.exports = function addShortCodes(eleventyConfig) {
  eleventyConfig.addShortcode("postList", postList);
  eleventyConfig.addShortcode("paginatedNavigation", paginatedNavigation);
  eleventyConfig.addShortcode("postTag", postTag);
  eleventyConfig.addShortcode("postTagLink", postTagLink);
};
