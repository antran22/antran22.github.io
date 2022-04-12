module.exports = function () {
  const tags = {
    git: {
      icon: "🔀",
      title: "Learn version controlling with git",
    },
    linux: {
      icon: "🐧",
      title: "Linux",
    },
    foss: {
      icon: "🔓",
      title: "Open Source Movement",
    },
  };

  for (let name in tags) {
    tags[name].name = name;
  }

  return tags;
};
