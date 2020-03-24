export type URL = string;

import { AuthEndpoint } from '@/api/auth';

export interface Api {
  auth: AuthEndpoint;
}
export interface DoctorItem {
  name: string;
  surname: string;
  patronymics: string;
  description: string;
  specialities: {id: number; title: string}[];
  image: string;
}
