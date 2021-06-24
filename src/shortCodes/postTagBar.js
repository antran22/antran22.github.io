const { postTagLink } = require("./postTag");

module.exports = function postTagBar(post) {
  const tagInfos = getTagInfosOfPost(post);
  const tagSpans = tagInfos.map(postTagLink);
  return `<p>${tagSpans.join("")}</p>`;
};

function getTagInfosOfPost(post) {
  const { availableTags, tags } = post.data;
  const unfilteredTagData = tags.map((tag) => availableTags[tag]);
  return unfilteredTagData.filter((data) => !!data);
}
