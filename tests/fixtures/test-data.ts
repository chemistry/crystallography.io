export const URLS = {
  base: process.env.BASE_URL || 'https://crystallography.io',
  endpoints: {
    // Web
    home: '/',
    catalog: '/catalog',
    authors: '/authors',
    structure: '/structure/1000000',
    searchName: '/search/name',
    searchFormula: '/search/formula',
    searchAuthor: '/search/author',
    searchUnitCell: '/search/unitcell',
    about: '/about',

    // API
    apiRoot: '/api',
    healthCheck: '/hc',
    catalogApi: '/api/v1/catalog',
    authorsApi: '/api/v1/authors',
    structureApi: '/api/v1/structure/1000000',
    autocompleteName: '/api/v1/autocomplete/name',
    autocompleteAuthor: '/api/v1/autocomplete/author',
    searchNameApi: '/api/v1/search/name',
    searchFormulaApi: '/api/v1/search/formula',
    searchAuthorApi: '/api/v1/search/author',
    searchUnitCellApi: '/api/v1/search/unit-cell',
    cifDownload: '/cif/1000000',
    sitemap: '/sitemap.xml',
  },
} as const;

export const TEST_CONFIG = {
  timeouts: {
    api: 10_000,
    page: 15_000,
    navigation: 10_000,
  },
  retries: {
    api: 2,
  },
} as const;

export const TEST_DATA = {
  search: {
    authorName: 'Smith',
    structureName: 'diamond',
    formula: 'C',
    unitCell: {
      a: 5.4,
      b: 5.4,
      c: 5.4,
      alpha: 90,
      beta: 90,
      gamma: 90,
      tolerance: 1,
    },
  },
  knownStructureId: '1000000',
} as const;
