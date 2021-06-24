function postTag(tagInfo) {
  return `
        <code class="post-tag-span">
          ${tagInfo.icon}&nbsp;${tagInfo.name}
        </code>`;
}

function postTagLink(tagInfo) {
  return `<a href="/tags/${tagInfo.name}" class="post-tag-link">
        ${postTag(tagInfo)} 
    </a>`;
}

module.exports = {
  postTag,
  postTagLink,
};
