const Image = require("@11ty/eleventy-img");
const path = require("path");

module.exports = async function (src, alt, caption = alt, sizes = "100w") {
  const metadata = await Image(path.join("src/views/images", src), {
    widths: [25, 160, 320, 960, 1200, 2400],
    urlPath: "/images/",
    outputDir: "_site/images/",
    formats: ["webp", "jpeg"],
  });

  const imageAttributes = {
    alt,
    sizes,
    loading: "lazy",
    decoding: "async",
  };
  const imageHtml = Image.generateHTML(metadata, imageAttributes, {
    whitespaceMode: "inline",
  }); // You bet we throw an error on missing alt in `imageAttributes` (alt="" works okay)

  return `<figure>${imageHtml}<figcaption>${caption}</figcaption></figure>`;
};
