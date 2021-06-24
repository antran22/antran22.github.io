module.exports = function paginatedNavigation(pagination, currentPageUrl) {
  const paginationLinks = pagination.hrefs.map(
    (href, index) => `
    <a
        href="${href}"
        ${currentPageUrl === href ? 'aria-current="page"' : ""}
    >${index}</a>
    `
  );

  return `
  <nav id="page-nav">
    ${buildJumpPageLink(pagination.href.first, currentPageUrl, "◀◀")}
    ${buildNavigationIconLink(pagination.href.previous, "◀")}
    ${paginationLinks.join("")}
    ${buildNavigationIconLink(pagination.href.next, "️▶")}
    ${buildJumpPageLink(pagination.href.last, currentPageUrl, "▶▶")}
  </nav>
  `;
};

function buildNavigationIconLink(href, icon) {
  if (href) {
    return `<a href="${href}">${icon}</a>`;
  }
  return `<a style="visibility: hidden">${icon}</a>`;
}

function buildJumpPageLink(firstHref, currentPageUrl, icon) {
  if (firstHref === currentPageUrl) {
    return buildNavigationIconLink(null, icon);
  }
  return buildNavigationIconLink(firstHref, icon);
}
