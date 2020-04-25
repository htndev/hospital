export const API_URL = 'https://htn-hospital-backend.herokuapp.com';

export const DEFAULT_DOCTOR_IMAGE = 'DEFAULT_DOCTOR.jpg';

export const PATTERNS: {[key: string]: () => RegExp} = {
  PASSWORD: (): RegExp => /^[\S.]{6,}$/g,
  PHONE: (): RegExp => /^[0-9]{12}$/g,
  ONLY_DIGITS: (): RegExp => /^\d*$/g,
  ONLY_LETTERS: (): RegExp => /[a-zа-яїё]+/gi,
  ONLY_LETTERS_AND_SPACE: (): RegExp => /[\sa-zа-яїё]+/gi,
  ANY_SYMBOL: (): RegExp => /.*/gi,
  NOT_EMPTY: (): RegExp => /.+/gi
};

export const SHOW_ALERT = 'show:alert';

export const FILES_PATH = `${API_URL}/files`;

export const IMAGES_PATH = `${FILES_PATH}/images`;

export const DOCTOR_IMAGES_PATH = `${IMAGES_PATH}/doctors`;

export const MAX_NAME_LENGTH = 255;

export const MAX_SURNAME_LENGTH = 255;

export const MAX_PATRONYMICS_LENGTH = 255;

export const MAX_PHONE_LENGTH = 12;

export const MAX_PASSWORD_LENGTH = 100;

export const SECONDS_IN_DAY = 86400;
