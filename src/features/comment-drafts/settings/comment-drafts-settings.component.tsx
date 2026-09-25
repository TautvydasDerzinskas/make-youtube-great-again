import * as React from 'react';

import BackToFeaturesComponent from '../../../popup/tabs/features/settings/back-to-features/back-to-features.component';

import commentDraftsService, { ICommentDraft } from '../services/comment-drafts.service';
import MetaCommentDrafts from '../meta';

import './comment-drafts-settings.component.scss';

interface ICommentDraftsSettingsComponentState {
  drafts: ICommentDraft[];
  editingDraftId: string;
  editingText: string;
}

export default class CommentDraftsSettingsComponent extends React.Component<{}, ICommentDraftsSettingsComponentState> {
  private removeStorageListener: () => void;

  constructor(props: {}) {
    super(props);
    this.state = {
      drafts: [],
      editingDraftId: null,
      editingText: '',
    };
  }

  componentDidMount() {
    this.loadDrafts();
    this.removeStorageListener = commentDraftsService.onChange(() => this.loadDrafts());
  }

  componentWillUnmount() {
    this.removeStorageListener();
  }

  private loadDrafts() {
    commentDraftsService.getAll().then(drafts => this.setState({ drafts }));
  }

  private videoUrl(draft: ICommentDraft) {
    return `https://www.youtube.com/watch?v=${draft.videoId}`;
  }

  /**
   * Opens the video, whose tab types the comment into YouTube™'s comment box & posts it
   */
  private publish(draft: ICommentDraft) {
    commentDraftsService.requestPublish(draft.id).then(() => {
      chrome.tabs.create({ url: this.videoUrl(draft) });
    });
  }

  private edit(draft: ICommentDraft) {
    this.setState({ editingDraftId: draft.id, editingText: draft.text });
  }

  private saveEdit() {
    const text = this.state.editingText.trim();
    if (text) {
      commentDraftsService.update(this.state.editingDraftId, text);
      this.setState({ editingDraftId: null, editingText: '' });
    }
  }

  private remove(draft: ICommentDraft) {
    if (confirm('Delete this draft comment?')) {
      commentDraftsService.remove(draft.id);
    }
  }

  private renderDraft(draft: ICommentDraft) {
    const isEditing = this.state.editingDraftId === draft.id;

    return (
      <div className='cd-settings__draft' key={draft.id}>
        <a className='cd-settings__thumbnail' href={this.videoUrl(draft)} target='_blank' title='Open the video'>
          <img src={`https://i.ytimg.com/vi/${encodeURIComponent(draft.videoId)}/mqdefault.jpg`} alt='' />
        </a>
        <div className='cd-settings__details'>
          <a className='cd-settings__title' href={this.videoUrl(draft)} target='_blank' title={draft.videoTitle}>
            {draft.videoTitle}
          </a>
          <div className='cd-settings__age'>Saved {commentDraftsService.formatAge(draft.updatedAt)}</div>

          {isEditing
            ? <textarea
                className='cd-settings__editor'
                value={this.state.editingText}
                rows={4}
                autoFocus
                onChange={event => this.setState({ editingText: event.target.value })}
              />
            : <div className='cd-settings__text'>{draft.text}</div>}

          <div className='cd-settings__actions'>
            {isEditing
              ? <>
                  <button type='button' className='cd-settings__button' onClick={() => this.setState({ editingDraftId: null })}>Cancel</button>
                  <button type='button' className='cd-settings__button cd-settings__button--primary' onClick={() => this.saveEdit()}>Save</button>
                </>
              : <>
                  <button type='button' className='cd-settings__button' onClick={() => this.remove(draft)}>Delete</button>
                  <button type='button' className='cd-settings__button' onClick={() => this.edit(draft)}>Edit</button>
                  <button
                    type='button'
                    className='cd-settings__button cd-settings__button--primary'
                    title='Opens the video & posts the comment'
                    onClick={() => this.publish(draft)}
                  >Publish</button>
                </>}
          </div>
        </div>
      </div>
    );
  }

  render() {
    return (
      <div className='cd-settings'>
        <BackToFeaturesComponent featureName={MetaCommentDrafts.title} />
        {this.state.drafts.length > 0
          ? <div className='cd-settings__list'>{this.state.drafts.map(draft => this.renderDraft(draft))}</div>
          : <div className='cd-settings__none'>No drafts yet. Write a comment under any video & click "Create a Draft".</div>}
      </div>
    );
  }
}
