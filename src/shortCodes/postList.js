const prettyDate = require("pretty-date");
const postTagBar = require("./postTagBar");

const getSlugFromPost = require("../functions/getSlugFromPost");

module.exports = function postList(posts) {
  const entries = posts.map(buildPostEntry);

  return `
      ${entries.join("")} 
  `;
};

function buildPostEntry(post) {
  const slug = getSlugFromPost(post);
  return `
    <div class="row post-entry" aria-labelledby="${slug}"> 
      <h5 id="${slug}"> 
          <a href="${post.url}">${post.data.title}</a>
      </h5>
      <p>
          <i class="post-entry-date">${prettyDate.format(post.date)}</i>
      </p>
      ${postTagBar(post)}
      <p>${post.data.summary}</p>
    </div>
    <hr/>
`;
}
