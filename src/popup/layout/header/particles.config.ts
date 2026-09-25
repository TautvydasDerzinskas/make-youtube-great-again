import type { ISourceOptions } from '@tsparticles/engine';

const particlesConfig: ISourceOptions = {
  fullScreen: { enable: false },
  detectRetina: true,
  particles: {
    // Matches the particle count particles.js produced for the header size
    number: { value: 20 },
    color: { value: '#ea0986' },
    shape: { type: 'circle' },
    opacity: { value: 0.7 },
    size: { value: { min: 0.1, max: 3 } },
    links: {
      enable: true,
      distance: 150,
      color: '#ee592a',
      opacity: 0.4,
      width: 1,
    },
    move: {
      enable: true,
      speed: 5,
      direction: 'none',
      random: true,
      straight: false,
      outModes: { default: 'bounce' },
    },
  },
  interactivity: {
    events: {
      onHover: { enable: true, mode: 'repulse' },
      onClick: { enable: true, mode: 'push' },
    },
    modes: {
      repulse: { distance: 100, duration: 0.4 },
      push: { quantity: 4 },
    },
  },
};

export default particlesConfig;
