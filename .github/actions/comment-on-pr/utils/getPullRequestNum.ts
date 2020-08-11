/**
 * Abstracts away difference of push and pull_request events.
 */

import { OktoKit } from './types';
import { Context } from '@actions/github/lib/context';

/**
 * @throws if PR not found
 */
export default async function getPullRequestNumber(
  oktakit: OktoKit,
  context: Context
) {
  // context.payload.action === 'pull_request':
  if (context.issue.number) return context.issue.number;

  // On push event have to find if there is a pull request

  const pulls = await oktakit.pulls.list({ ...context.repo, state: 'open' });
  const pr = pulls.data.find(p => p.head.sha === context.sha);

  if (!pr) throw new Error('No Pull Request Found');

  return pr.number;
}
