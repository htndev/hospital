import { AuthEndpoint } from '@/api/auth';
import { UserEndpoint } from '@/api/user';
import { DoctorEndpoint } from '@/api/doctor';
import { SpecialitiesEndpoint } from '@/api/specialities';

export type URL = string;


export interface Api {
  auth: AuthEndpoint;
  user: UserEndpoint;
  doctor: DoctorEndpoint;
  specialities: SpecialitiesEndpoint;
}

export interface DoctorItem {
  name: string;
  surname: string;
  patronymics: string;
  description: string;
  specialities: {id: number; title: string}[];
  image: string;
}
