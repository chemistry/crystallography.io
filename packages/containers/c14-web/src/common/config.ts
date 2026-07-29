const isBrowser = typeof window !== 'undefined';

export const API_BASE_URL = isBrowser
  ? ''
  : process.env.API_BASE_URL || 'https://crystallography.io';

// /api/v1/search/structure/* is served by searchrouter, not c14-api (issue #231)
export const SEARCH_API_BASE_URL = isBrowser
  ? ''
  : process.env.SEARCH_API_BASE_URL || process.env.API_BASE_URL || 'https://crystallography.io';
