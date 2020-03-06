export type URL = string;

import { UserEndpoint } from '@/api/user';

export interface Api {
  user: UserEndpoint;
}
