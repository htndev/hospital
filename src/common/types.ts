import { AuthEndpoint } from '@/api/auth';
import { UserEndpoint } from '@/api/user';
import { DoctorEndpoint } from '@/api/doctor';
import { SpecialitiesEndpoint } from '@/api/specialities';
import { CallbackEndpoint } from '@/api/callback';
import { BookEndpoint } from '@/api/book';
import { StatsEndpoint } from '@/api/stats';

export type URL = string;

export interface Api {
  auth: AuthEndpoint;
  user: UserEndpoint;
  doctor: DoctorEndpoint;
  specialities: SpecialitiesEndpoint;
  callback: CallbackEndpoint;
  book: BookEndpoint;
  stats: StatsEndpoint;
}

export interface DoctorItem {
  name: string;
  surname: string;
  patronymics: string;
  description: string;
  specialities: { id: number; title: string }[];
  image: string;
}
