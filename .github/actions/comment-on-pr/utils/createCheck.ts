/**
 * Create a status check
 *
 * Resolves to an updater function for that check.
 */

import { Context } from '@actions/github/lib/context';
import { DetailsI, OktoKit } from './types';

type UpdateCheck = (details: DetailsI) => void;

export async function createCheck(
  oktokit: OktoKit,
  context: Context,
  name: string
): Promise<UpdateCheck> {
  const check = await oktokit.checks.create({
    ...context.repo,
    name,
    head_sha: context.sha,
    status: 'in_progress'
  });

  return async (details: DetailsI) => {
    await oktokit.checks.update({
      ...context.repo,
      check_run_id: check.data.id,
      completed_at: new Date().toISOString(),
      status: 'completed',
      ...details
    });
  };
}
