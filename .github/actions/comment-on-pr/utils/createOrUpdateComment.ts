/**
 * Creates a comment on the pull request corresponding to number passed in,
 * or updates the comment if this action already created one
 *
 * Uses a comment to mark the comment so it can be found and updated.
 */

import { endGroup, startGroup } from '@actions/core';
import { Context } from '@actions/github/lib/context';
import { OktoKit } from './types';

export async function postOrUpdateComment(
  oktokit: OktoKit,
  context: Context,
  prNumber: number,
  commentMarkdown: string
) {
  const commentInfo = {
    ...context.repo,
    issue_number: prNumber
  };

  // used to find and update the comment
  const commentMarkingText = 'pr-comment-action__do-not-edit-this-string';

  const comment = {
    ...commentInfo,
    body: `${commentMarkdown}\n\n<!--- ${commentMarkingText} --->`
  };

  startGroup(`Updating PR comment`);

  let commentId: number | undefined = undefined;

  try {
    const comments = await oktokit.issues.listComments(commentInfo);

    commentId = comments.data.find(
      c => c.user.type === 'Bot' && c.body.indexOf(commentMarkingText) !== -1
    )?.id;
  } catch (e) {
    console.log('Error checking for previous comments: ' + e.message);
  }

  try {
    if (commentId)
      await oktokit.issues.updateComment({
        ...context.repo,
        comment_id: commentId,
        body: comment.body
      });
    else await oktokit.issues.createComment(comment);
  } catch (e) {
    console.log(`Error creating comment: ${e.message}`);
  }

  endGroup();
}
