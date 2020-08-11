import { getInput, setFailed } from '@actions/core';
import * as github from '@actions/github';
import { OktoKit } from './utils/types';
// import { createCheck } from './utils/createCheck';
import { postOrUpdateComment } from './utils/createOrUpdateComment';
import getPullRequestNumber from './utils/getPullRequestNum';

const run = async () => {
  const token = process.env.GITHUB_TOKEN || getInput('repo-token');
  const commentToPost = getInput('comment', { required: true });

  if (!token) {
    console.error('No Token');
    return;
  }

  const oktokit: OktoKit = github.getOctokit(token);
  let prNumber: number;

  try {
    prNumber = await getPullRequestNumber(oktokit, github.context);
  } catch {
    console.error('No PR Found');
    return;
  }

  // const finish = await createCheck(oktokit, github.context, 'comment-on-pr');

  const message = `${commentToPost}\n\n<sub>(${new Date().toUTCString()})</sub>`;

  try {
    await postOrUpdateComment(oktokit, github.context, prNumber, message);
    // finish({ conclusion: 'success' });
  } catch (e) {
    setFailed(e.message);
    // finish({ conclusion: 'failure' });
  }
};

run();
