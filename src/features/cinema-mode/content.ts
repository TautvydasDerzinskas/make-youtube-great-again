import svgIconsService from '../../services/content/svg-icons.service';
import actionButtonService from '../../services/content/action-button.service';

import IContent from '../../interfaces/content';

import '../../services/content/action-button.scss';
import './styles/cinema-mode.scss';

const ACTIVE_CLASS = 'myga-cinema-mode--active';
const LIFTED_CLASS = 'myga-cinema-mode__lifted';
const OVERLAY_ID = 'myga-cinema-overlay';

/**
 * Fades the page out with a dark layer & lifts the player above it
 */
class ContentCinemaMode implements IContent {
  private buttonsObserver: MutationObserver;
  private playerResizeObserver: ResizeObserver;
  private isActive = false;

  private onKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape' && this.isActive) {
      this.setActive(false);
    }
  };

  // Leaving the video page (e.g. to the home page with the miniplayer) must not leave the page dark
  private onNavigate = () => this.setActive(false);

  get cinemaButton() {
    return document.getElementsByClassName('myga-cinema-btn')[0] as HTMLButtonElement;
  }

  public extendPageUserInterface() {
    this.cleanUp();

    const $button = actionButtonService.create('myga-cinema-btn', 'Cinema', svgIconsService.iconCinema, 'Fade out everything around the video', 'Leave cinema mode');
    this.buttonsObserver = actionButtonService.attach($button);

    document.addEventListener('keydown', this.onKeyDown, true);
    document.addEventListener('yt-navigate-start', this.onNavigate);
  }

  public setupEventListeners() {
    this.cinemaButton.addEventListener('click', () => this.setActive(!this.isActive));
  }

  public cleanUp() {
    this.setActive(false);

    if (this.buttonsObserver) {
      this.buttonsObserver.disconnect();
      this.buttonsObserver = null;
    }
    document.querySelectorAll('.myga-cinema-btn').forEach(button => button.remove());

    document.removeEventListener('keydown', this.onKeyDown, true);
    document.removeEventListener('yt-navigate-start', this.onNavigate);
  }

  private setActive(isActive: boolean) {
    if (isActive === this.isActive) {
      return;
    }
    this.isActive = isActive;

    if (this.cinemaButton) {
      actionButtonService.setActive(this.cinemaButton, isActive);
    }

    if (isActive) {
      this.start();
    } else {
      this.stop();
    }
  }

  private start() {
    const player = document.getElementById('movie_player');
    if (!player) {
      this.isActive = false;
      return;
    }

    player.scrollIntoView({ block: 'center' });
    document.documentElement.classList.add(ACTIVE_CLASS);

    const overlay = document.createElement('div');
    overlay.id = OVERLAY_ID;
    overlay.addEventListener('click', () => this.setActive(false));
    overlay.addEventListener('contextmenu', (event: Event) => {
      event.preventDefault();
      this.setActive(false);
    });

    const hint = document.createElement('div');
    hint.className = 'myga-cinema-overlay__hint';
    hint.textContent = 'Click anywhere around the video or press Esc to leave cinema mode';
    overlay.append(hint);

    document.body.append(overlay);
    // Next frame, so the fade in transition runs
    requestAnimationFrame(() => overlay.classList.add(`${OVERLAY_ID}--visible`));

    this.liftPlayer();
    // The player's container changes with the layout (default, theater), so it's looked up again
    this.playerResizeObserver = new ResizeObserver(() => this.liftPlayer());
    this.playerResizeObserver.observe(player);
  }

  private stop() {
    document.documentElement.classList.remove(ACTIVE_CLASS);

    if (this.playerResizeObserver) {
      this.playerResizeObserver.disconnect();
      this.playerResizeObserver = null;
    }

    const overlay = document.getElementById(OVERLAY_ID);
    if (overlay) {
      overlay.classList.remove(`${OVERLAY_ID}--visible`);
      // Lifted until faded out, so the video doesn't vanish under the fading layer
      setTimeout(() => {
        overlay.remove();
        if (!this.isActive) {
          this.unliftPlayer();
        }
      }, 400);
    } else {
      this.unliftPlayer();
    }
  }

  /**
   * Raising the player itself isn't enough: one of its containers forms its own stacking layer.
   * So the outermost container holding nothing but the player is raised instead.
   */
  private liftPlayer() {
    const player = document.getElementById('movie_player');
    if (!player) {
      return;
    }

    let container: HTMLElement = player;
    while (container.parentElement && container.parentElement !== document.body && !this.containsOtherContent(container.parentElement)) {
      container = container.parentElement;
    }

    if (!container.classList.contains(LIFTED_CLASS)) {
      this.unliftPlayer();
      container.classList.add(LIFTED_CLASS);
    }
  }

  private containsOtherContent(element: HTMLElement) {
    return Boolean(element.querySelector('#below, #secondary, ytd-watch-metadata, #masthead-container'));
  }

  private unliftPlayer() {
    document.querySelectorAll(`.${LIFTED_CLASS}`).forEach(element => element.classList.remove(LIFTED_CLASS));
  }
}

export default new ContentCinemaMode();
