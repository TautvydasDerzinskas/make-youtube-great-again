/**
 * YouTube™'s internal API ("InnerTube"), as its own pages call it.
 * Page world only: needs the page's ytcfg & cookies.
 */
interface IYtcfg {
  get(key: string): any;
}

class InnertubeService {
  get ytcfg(): IYtcfg {
    const ytcfg: IYtcfg = (window as any).ytcfg;
    if (!ytcfg || !ytcfg.get('INNERTUBE_CONTEXT')) {
      throw new Error('YouTube™ API config not found');
    }
    return ytcfg;
  }

  public async post(endpoint: string, body: object = {}) {
    const response = await fetch(`/youtubei/v1/${endpoint}?prettyPrint=false`, {
      method: 'POST',
      credentials: 'same-origin',
      headers: await this.getHeaders(),
      body: JSON.stringify({ context: this.ytcfg.get('INNERTUBE_CONTEXT'), ...body }),
    });
    if (!response.ok) {
      throw new Error(`${endpoint} request failed (${response.status})`);
    }
    return response.json();
  }

  /**
   * Signed in users' data needs the same auth header YouTube™'s own requests send
   */
  private async getHeaders() {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'X-Youtube-Client-Name': String(this.ytcfg.get('INNERTUBE_CONTEXT_CLIENT_NAME') || 1),
      'X-Youtube-Client-Version': String(this.ytcfg.get('INNERTUBE_CONTEXT_CLIENT_VERSION') || ''),
      'X-Goog-AuthUser': String(this.ytcfg.get('SESSION_INDEX') || 0),
      'X-Origin': location.origin,
    };

    const sapisid = this.getCookie('SAPISID') || this.getCookie('__Secure-3PAPISID');
    if (sapisid) {
      const timestamp = Math.floor(Date.now() / 1000);
      const hash = await this.sha1(`${timestamp} ${sapisid} ${location.origin}`);
      headers['Authorization'] = `SAPISIDHASH ${timestamp}_${hash}`;
    }

    return headers;
  }

  private getCookie(name: string) {
    const cookie = document.cookie.split('; ').find(item => item.startsWith(`${name}=`));
    return cookie ? cookie.substring(name.length + 1) : null;
  }

  private async sha1(text: string) {
    const digest = await crypto.subtle.digest('SHA-1', new TextEncoder().encode(text));
    return [...new Uint8Array(digest)].map(byte => byte.toString(16).padStart(2, '0')).join('');
  }
}

export default new InnertubeService();
