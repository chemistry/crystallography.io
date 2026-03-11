const isBrowser = typeof window !== 'undefined';

export const API_BASE_URL = isBrowser
  ? ''
  : process.env.API_BASE_URL || 'https://crystallography.io';
