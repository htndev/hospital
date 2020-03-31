export const API_URL = 'http://localhost:3000';

export const DEFAULT_DOCTOR_IMAGE = 'https://image.freepik.com/free-vector/doctor-character-background_1270-84.jpg';

export const PATTERNS: {[key: string]: () => RegExp} = {
  PASSWORD: (): RegExp => /^[\S.]{6,}$/g,
  PHONE: (): RegExp => /^[0-9]{12}$/g,
  ONLY_DIGITS: (): RegExp => /^\d*$/g
};

export const SHOW_ALERT = 'show:alert';

export const FILES_PATH = `${API_URL}/files`;

export const IMAGES_PATH = `${FILES_PATH}/images`;

export const MAX_NAME_LENGTH = 255;

export const MAX_SURNAME_LENGTH = 255;

export const MAX_PATRONYMICS_LENGTH = 255;

export const MAX_PHONE_LENGTH = 12;

export const MAX_PASSWORD_LENGTH = 100;
