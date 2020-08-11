import { GitHub } from '@actions/github/lib/utils';

export type OktoKit = InstanceType<typeof GitHub>;

export interface DetailsI {
  conclusion:
    | 'success'
    | 'failure'
    | 'neutral'
    | 'cancelled'
    | 'skipped'
    | 'timed_out'
    | 'action_required';

  output?: {
    title: string;
    summary: string;
  };
}
