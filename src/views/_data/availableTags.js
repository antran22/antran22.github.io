module.exports = function () {
  const tags = {
    blog: {
      icon: "📝",
      title: "Blog"
    },
    writeUp: {
      icon: "📒",
      title: "Technical Write Up",
    },
    foss: {
      icon: "🔓",
      title: "FOSS",
    },
  };

  for (let name in tags) {
    tags[name].name = name;
  }

  return tags;
};
