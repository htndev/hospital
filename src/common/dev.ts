import { DoctorItem, URL } from '@/common/types';
import { DEFAULT_DOCTOR_IMAGE, DOCTOR_IMAGES_PATH } from '@/common/constants';

export const combineUrl = (issuer: string, ...paths: string[]): URL => {
  issuer = issuer[issuer.length - 1] === '/' ? issuer : issuer + '/';
  return `${issuer}${paths.join('/')}`;
};

export const getImageSrc = (image: string | null = null): string => `${DOCTOR_IMAGES_PATH}/${image ? image : DEFAULT_DOCTOR_IMAGE}`;

export const getInitials = (doctor: DoctorItem): string => `${doctor.surname} ${doctor.name[0]}.${doctor.patronymics ? ` ${doctor.patronymics[0]}.` : '' }`;
