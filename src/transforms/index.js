const htmlmin = require("html-minifier");

function outputHTMLMinify(content, outputPath) {
  if (outputPath && outputPath.endsWith(".html")) {
    return htmlmin.minify(content, {
      useShortDoctype: true,
      removeComments: true,
      collapseWhitespace: true,
    });
  }

  return content;
}
module.exports = function addTransforms(eleventyConfig) {
  eleventyConfig.addTransform("htmlmin", outputHTMLMinify);
};
