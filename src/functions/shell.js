module.exports = function (
  content,
  language = "bash",
  user = "antran",
  host = "ubuntu",
  output_prefix = "%|",
  continuation = "\\"
) {
  return `<pre
        class="command-line"
        data-user="${user}"
        data-host="${host}"
        data-filter-output="${output_prefix}"
        data-continuation-str="${continuation}"
        data-continuation-prompt=">"
      ><code class="language-${language}">${content.trim()}</code></pre>`;
};
