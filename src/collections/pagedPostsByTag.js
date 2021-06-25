const _ = require("lodash");
const allPosts = require("./allPosts");

module.exports = function pagedPostsByTag(collection) {
  const posts = allPosts(collection);

  const postsByTag = groupPostsByTag(posts);

  return pagePostOfTags(postsByTag);
};

function groupPostsByTag(posts) {
  return _.reduce(
    posts,
    (result, post) => {
      const tags = post.data.tags;
      if (tags) {
        tags.forEach((tag) => {
          (result[tag] || (result[tag] = [])).push(post);
        });
      }
      return result;
    },
    {}
  );
}

function pagePostOfTags(postsByTag) {
  return _.reduce(
    postsByTag,
    (result, posts, tag) => {
      const chunkedPosts = _.chunk(posts, 10);
      const totalPageNumber = chunkedPosts.length;

      const hrefPrefix = `/tags/${tag}`;

      const allHrefs = chunkedPosts.map((value, pageNumber) =>
        hrefForPageNumber(hrefPrefix, pageNumber)
      );

      chunkedPosts.forEach((chunk, chunkIndex) => {
        const pageNumber = chunkIndex + 1;

        result.push({
          tagName: tag,
          pageNumber,
          hrefs: allHrefs,
          href: buildHrefsForPagination(
            hrefPrefix,
            pageNumber,
            totalPageNumber
          ),
          posts: chunk,
        });
      });
      return result;
    },
    []
  );
}

function buildHrefsForPagination(hrefPrefix, pageNumber, totalPageNumber) {
  const nextPageNumber =
    pageNumber + 1 > totalPageNumber ? null : pageNumber + 1;
  const previousPageNumber = pageNumber - 1 < 1 ? null : pageNumber - 1;

  return {
    current: hrefForPageNumber(hrefPrefix, pageNumber),
    next: hrefForPageNumber(hrefPrefix, nextPageNumber),
    previous: hrefForPageNumber(hrefPrefix, previousPageNumber),
    first: hrefForPageNumber(hrefPrefix, 1),
    last: hrefForPageNumber(hrefPrefix, totalPageNumber),
  };
}

function hrefForPageNumber(hrefPrefix, pageNumber) {
  if (_.isNil(pageNumber)) {
    return null;
  }
  return `${hrefPrefix}/${pageNumberToHrefSuffix(pageNumber)}`;
}

function pageNumberToHrefSuffix(pageNumber) {
  if (pageNumber > 1) {
    return `${pageNumber}/`;
  }
  return "";
}
