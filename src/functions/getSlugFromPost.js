const slugify = require("slugify");

module.exports = function getSlugFromPost(post) {
  const data = post.data;
  if (data.title) {
    return slugify(data.title, { lower: true });
  }
  const urlSegments = data.url.split("/");
  return urlSegments[urlSegments.length - 1];
};
