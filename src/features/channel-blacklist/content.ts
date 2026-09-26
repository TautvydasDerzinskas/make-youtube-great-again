import channelBlacklistService, { IChannel } from './services/channel-blacklist.service';
import channelFinder, { IFoundChannel, VIDEO_ITEMS } from './channel-finder';
import tooltipService from '../../services/content/tooltip.service';
import actionButtonService from '../../services/content/action-button.service';
import confirmDialogService from '../../services/content/confirm-dialog.service';

import IContent from '../../interfaces/content';

import iconBlock from '../../assets/vectors/block.svg';

import '../../services/content/action-button.scss';
import './styles/channel-blacklist.scss';

const HIDDEN_ATTRIBUTE = 'data-myga-blacklisted';
const HOVER_BUTTON_CLASS = 'myga-blacklist-btn';
const OWNER_BUTTON_CLASS = 'myga-blacklist-owner-btn';
const SCAN_DELAY = 150;

/**
 * Hides videos of blacklisted channels everywhere YouTube™ lists videos,
 * and adds buttons to blacklist a channel from its videos
 */
class ContentChannelBlacklist implements IContent {
  private channels: IChannel[] = [];
  private pageObserver: MutationObserver;
  private removeStorageListener: () => void;
  private scanTimer: ReturnType<typeof setTimeout>;
  private ownerButtonObserver: MutationObserver;
  private onNavigate = () => this.scheduleScan();

  /**
   * Runs on the first page & on every video page. The watcher keeps running across YouTube™'s
   * in-page navigation (home, search, channels…), where features aren't set up again.
   */
  public extendPageUserInterface() {
    if (!this.pageObserver) {
      this.pageObserver = new MutationObserver(() => this.scheduleScan());
      this.pageObserver.observe(document.body, { childList: true, subtree: true });
      document.addEventListener('yt-navigate-finish', this.onNavigate);
      this.removeStorageListener = channelBlacklistService.onChange(() => this.load());
    }
    this.load();
  }

  public cleanUp() {
    clearTimeout(this.scanTimer);
    if (this.pageObserver) {
      this.pageObserver.disconnect();
      this.pageObserver = null;
    }
    if (this.removeStorageListener) {
      this.removeStorageListener();
      this.removeStorageListener = null;
    }
    document.removeEventListener('yt-navigate-finish', this.onNavigate);
    if (this.ownerButtonObserver) {
      this.ownerButtonObserver.disconnect();
      this.ownerButtonObserver = null;
    }

    document.querySelectorAll(`[${HIDDEN_ATTRIBUTE}]`).forEach(element => element.removeAttribute(HIDDEN_ATTRIBUTE));
    document.querySelectorAll(`.${HOVER_BUTTON_CLASS}, .${OWNER_BUTTON_CLASS}`).forEach(button => button.remove());
    this.channels = [];
  }

  private async load() {
    this.channels = await channelBlacklistService.getAll();
    this.scan();
  }

  private isBlacklisted(channel: Pick<IChannel, 'handle' | 'name'>) {
    return this.channels.some(blacklisted => channelBlacklistService.isSameChannel(blacklisted, channel));
  }

  /**
   * YouTube™ changes the page constantly (and reuses items for other videos), so it's checked in batches
   */
  private scheduleScan() {
    if (this.scanTimer) {
      return;
    }
    this.scanTimer = setTimeout(() => {
      this.scanTimer = null;
      this.scan();
    }, SCAN_DELAY);
  }

  private scan() {
    document.querySelectorAll(VIDEO_ITEMS).forEach(item => {
      // Nested items (a lockup inside a renderer) are handled by the outermost one
      if (item.parentElement && item.parentElement.closest(VIDEO_ITEMS)) {
        return;
      }

      const channel = channelFinder.find(item);
      // Home feed: the whole grid cell, so no gap is left
      const container = item.closest('ytd-rich-item-renderer') || item;

      if (channel && this.isBlacklisted(channel)) {
        container.setAttribute(HIDDEN_ATTRIBUTE, '');
      } else {
        container.removeAttribute(HIDDEN_ATTRIBUTE);
      }

      if (channel) {
        this.insertHoverButton(item, channel);
      }
    });

    this.insertOwnerButton();
  }

  /**
   * Next to the channel's name, shown while hovering the video
   */
  private insertHoverButton(item: Element, channel: IFoundChannel) {
    let button = item.querySelector<HTMLButtonElement>(`.${HOVER_BUTTON_CLASS}`);
    if (!button || button.previousElementSibling !== channel.buttonAnchor) {
      if (button) {
        button.remove();
      }
      button = this.createButton(HOVER_BUTTON_CLASS, () => {
        // Items get reused for other videos: the channel is read at the click
        const current = channelFinder.find(item);
        if (current) {
          this.blacklist(current);
        }
      });
      channel.buttonAnchor.after(button);
    }
    tooltipService.attach(button, `Blacklist ${channel.name}`);
  }

  /**
   * With the extension's other buttons under the video, at the left end of the row:
   * blacklists the channel, or removes it from the blacklist
   */
  private insertOwnerButton() {
    const owner = channelFinder.findOwner();
    let button = document.querySelector<HTMLButtonElement>(`.${OWNER_BUTTON_CLASS}`);
    if (!owner) {
      return;
    }

    if (!button) {
      button = actionButtonService.create(OWNER_BUTTON_CLASS, 'Blacklist', iconBlock, 'Blacklist channel');
      button.addEventListener('click', () => {
        // The video may have changed since: the channel is read at the click
        const current = channelFinder.findOwner();
        if (!current) {
          return;
        }
        if (this.isBlacklisted(current)) {
          channelBlacklistService.remove(current);
        } else {
          this.blacklist(current);
        }
      });
      this.ownerButtonObserver = actionButtonService.attach(button, true);
    }

    const isBlacklisted = this.isBlacklisted(owner);
    button.dataset.mygaTooltipInactive = `Blacklist ${owner.name}: hide its videos everywhere`;
    button.dataset.mygaTooltipActive = `Remove ${owner.name} from the blacklist`;
    actionButtonService.setActive(button, isBlacklisted);
    const label = button.querySelector('.ytSpecButtonShapeNextButtonTextContent');
    label.textContent = isBlacklisted ? 'Blacklisted' : 'Blacklist';
  }

  private async blacklist(channel: IFoundChannel) {
    const confirmed = await confirmDialogService.confirm({
      title: `Blacklist ${channel.name}?`,
      message: 'Its videos will be hidden everywhere on YouTube™: home, search, the sidebar & playlists. You can remove it from the blacklist in the extension\'s popup.',
      confirmLabel: 'Blacklist',
    });
    if (confirmed) {
      await channelBlacklistService.add({ handle: channel.handle, name: channel.name, avatarUrl: channel.avatarUrl });
    }
  }

  /**
   * Clicks don't reach YouTube™'s own handlers, which would open the video
   */
  private createButton(className: string, onClick: () => void) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = className;
    button.setAttribute('aria-label', 'Blacklist channel');
    // Parsed, not innerHTML: the add-on validator flags every innerHTML
    button.append(new DOMParser().parseFromString(iconBlock, 'image/svg+xml').documentElement);
    button.addEventListener('click', (event: MouseEvent) => {
      event.preventDefault();
      event.stopPropagation();
      onClick();
    });
    return button;
  }
}

export default new ContentChannelBlacklist();
