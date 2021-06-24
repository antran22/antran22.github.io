module.exports = function () {
  const tags = {
    git: {
      icon: "🔀",
      title: "Learn version controlling with git",
    },
    gpg: {
      icon: "🔑",
      title: "Digital identity with GnuPG",
    },
  };

  for (let name in tags) {
    tags[name].name = name;
  }

  return tags;
};
