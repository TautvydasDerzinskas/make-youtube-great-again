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

// Player controls under the progress bar previews: the time follows the bar, play / pause stops it
const ICONS = {
  play: '<path d="M8 5v14l11-7z"/>',
  pause: '<path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>',
  volume: '<path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0 0 14 7.97v8.05A4.5 4.5 0 0 0 16.5 12zM14 3.23v2.06a7 7 0 0 1 0 13.42v2.06a9 9 0 0 0 0-17.54z"/>',
};
// Video lengths in seconds, one per preview so the cards don't all read alike
const DURATIONS = [213, 187, 264, 305, 158, 242, 331, 199, 276, 222, 251, 184, 290, 236];

const formatTime = (seconds) => `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`;
const icon = (name) => `<svg viewBox="0 0 24 24" aria-hidden="true">${ICONS[name]}</svg>`;

const players = [...document.querySelectorAll('.bar-preview')].map((preview, index) => {
  const duration = DURATIONS[index % DURATIONS.length];
  const controls = document.createElement('div');
  controls.className = 'player-controls';
  controls.innerHTML = `<button type="button" class="player-controls__button" aria-label="Pause preview">${icon('pause')}</button>`
    + `<span class="player-controls__button">${icon('volume')}</span>`
    + `<span class="player-controls__time">0:00 / ${formatTime(duration)}</span>`;
  preview.append(controls);

  const button = controls.querySelector('button');
  const scrubber = preview.querySelector('.ytp-scrubber-container');
  button.addEventListener('click', () => {
    const paused = preview.classList.toggle('bar-preview--paused');
    button.innerHTML = icon(paused ? 'play' : 'pause');
    button.setAttribute('aria-label', paused ? 'Play preview' : 'Pause preview');
    // The themes' own paused look
    const image = scrubber.style.backgroundImage.replace('__pause.gif', '.gif');
    scrubber.style.backgroundImage = paused ? image.replace('.gif', '__pause.gif') : image;
  });

  return { preview, duration, progress: preview.querySelector('.bar-preview__progress'), time: controls.querySelector('.player-controls__time'), text: '' };
});

// Only the previews on screen are updated
const visible = new Set();
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => (entry.isIntersecting ? visible.add(entry.target) : visible.delete(entry.target)));
});
players.forEach(player => observer.observe(player.preview));

(function tick() {
  players.forEach(player => {
    if (visible.has(player.preview)) {
      const text = `${formatTime(player.duration * player.progress.offsetWidth / player.preview.offsetWidth)} / ${formatTime(player.duration)}`;
      if (text !== player.text) {
        player.time.textContent = player.text = text;
      }
    }
  });
  requestAnimationFrame(tick);
})();
