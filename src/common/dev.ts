import { URL } from '@/common/types';

export const combineUrl = (issuer: string, ...paths: string[]): URL => {
  issuer = issuer[issuer.length - 1] === '/' ? issuer : issuer + '/';
  return `${issuer}${paths.join('/')}`;
};
