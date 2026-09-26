// Shows the latest release under the install buttons (the page works without it)
fetch('https://api.github.com/repos/TautvydasDerzinskas/make-youtube-great-again/releases/latest')
  .then(response => (response.ok ? response.json() : null))
  .then(release => {
    if (release && release.tag_name) {
      const date = new Date(release.published_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
      document.getElementById('latest-version').textContent = `Latest version ${release.tag_name}, released ${date}`;
    }
  })
  .catch(() => {});
