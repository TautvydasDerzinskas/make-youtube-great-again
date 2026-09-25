/**
 * The content script asks the page script for the signed in account,
 * shown as the drafts' author: only the page's world can call YouTube™'s API
 */
export const ACCOUNT_REQUEST_EVENT = 'myga-comment-drafts:account-request';
export const ACCOUNT_RESPONSE_EVENT = 'myga-comment-drafts:account-response';

export interface IAccount {
  name: string;
  handle: string;
  avatarUrl: string;
}

export interface IAccountResponse {
  account: IAccount;
}
