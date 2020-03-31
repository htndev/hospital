import { AuthEndpoint } from '@/api/auth';
import { UserEndpoint } from '@/api/user';

export type URL = string;


export interface Api {
  auth: AuthEndpoint;
  user: UserEndpoint;
}
export interface DoctorItem {
  name: string;
  surname: string;
  patronymics: string;
  description: string;
  specialities: {id: number; title: string}[];
  image: string;
}
