module.exports = function allPosts(collection) {
  return collection.getFilteredByGlob("./src/views/posts/*.md").reverse();
};
