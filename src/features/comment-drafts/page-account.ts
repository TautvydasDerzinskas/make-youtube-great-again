import innertubeService from '../../services/page/innertube.service';
import { ACCOUNT_REQUEST_EVENT, ACCOUNT_RESPONSE_EVENT, IAccount, IAccountResponse } from './comment-drafts.events';

/**
 * Runs in the page's own world. Asks for the same data YouTube™'s account menu shows.
 */
class AccountPage {
  private account: Promise<IAccount>;

  constructor() {
    document.addEventListener(ACCOUNT_REQUEST_EVENT, () => {
      this.getAccount().then(account => {
        const response: IAccountResponse = { account };
        document.dispatchEvent(new CustomEvent(ACCOUNT_RESPONSE_EVENT, { detail: JSON.stringify(response) }));
      });
    });
  }

  private getAccount() {
    if (!this.account) {
      this.account = innertubeService.post('account/account_menu')
        .then((json): IAccount => this.parseAccount(json))
        // Unknown account: drafts fall back to the generic avatar
        .catch((): IAccount => null);
    }
    return this.account;
  }

  /**
   * Signed out, there's no account header in the response
   */
  private parseAccount(json: any): IAccount {
    const header = this.find(json, 'activeAccountHeaderRenderer');
    if (!header) {
      return null;
    }

    const thumbnails = header.accountPhoto && header.accountPhoto.thumbnails || [];
    return {
      name: this.text(header.accountName),
      handle: this.text(header.channelHandle),
      avatarUrl: thumbnails.length ? thumbnails[thumbnails.length - 1].url : null,
    };
  }

  private text(value: any): string {
    if (!value) {
      return null;
    }
    return value.simpleText || (value.runs || []).map((run: { text: string }) => run.text).join('') || null;
  }

  private find(node: any, key: string): any {
    if (!node || typeof node !== 'object') {
      return null;
    }
    if (node[key]) {
      return node[key];
    }
    for (const childKey in node) {
      const found = this.find(node[childKey], key);
      if (found) {
        return found;
      }
    }
    return null;
  }
}

export default new AccountPage();
