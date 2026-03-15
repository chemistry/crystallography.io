import type { APIRequestContext } from '@playwright/test';
import { URLS, TEST_CONFIG } from './test-data.js';

export class ApiClient {
  constructor(private request: APIRequestContext) {}

  async getHealth() {
    return this.request.get(`${URLS.base}/hc`, {
      timeout: TEST_CONFIG.timeouts.api,
    });
  }

  async getApiRoot() {
    return this.request.get(`${URLS.base}${URLS.endpoints.apiRoot}`, {
      timeout: TEST_CONFIG.timeouts.api,
    });
  }

  async getCatalog(page = 1) {
    return this.request.get(`${URLS.base}${URLS.endpoints.catalogApi}?page=${page}`, {
      timeout: TEST_CONFIG.timeouts.api,
    });
  }

  async getAuthors(page = 1) {
    return this.request.get(`${URLS.base}${URLS.endpoints.authorsApi}?page=${page}`, {
      timeout: TEST_CONFIG.timeouts.api,
    });
  }

  async getStructure(id: string) {
    return this.request.get(`${URLS.base}/api/v1/structure/${id}`, {
      timeout: TEST_CONFIG.timeouts.api,
    });
  }

  async autocompleteName(name: string) {
    return this.request.get(`${URLS.base}${URLS.endpoints.autocompleteName}?name=${name}`, {
      timeout: TEST_CONFIG.timeouts.api,
    });
  }

  async autocompleteAuthor(name: string) {
    return this.request.get(`${URLS.base}${URLS.endpoints.autocompleteAuthor}?name=${name}`, {
      timeout: TEST_CONFIG.timeouts.api,
    });
  }

  async searchByName(name: string, page = 1) {
    return this.request.post(`${URLS.base}${URLS.endpoints.searchNameApi}`, {
      data: { name, page },
      timeout: TEST_CONFIG.timeouts.api,
    });
  }

  async searchByFormula(formula: string) {
    return this.request.post(`${URLS.base}${URLS.endpoints.searchFormulaApi}`, {
      data: { formula },
      timeout: TEST_CONFIG.timeouts.api,
    });
  }

  async searchByAuthor(name: string, page = 1) {
    return this.request.post(`${URLS.base}${URLS.endpoints.searchAuthorApi}`, {
      data: { name, page },
      timeout: TEST_CONFIG.timeouts.api,
    });
  }

  async searchByUnitCell(params: {
    a: number;
    b: number;
    c: number;
    alpha: number;
    beta: number;
    gamma: number;
    tolerance: number;
    page?: number;
  }) {
    return this.request.post(`${URLS.base}${URLS.endpoints.searchUnitCellApi}`, {
      data: params,
      timeout: TEST_CONFIG.timeouts.api,
    });
  }

  async downloadCif(id: string) {
    return this.request.get(`${URLS.base}/cif/${id}`, {
      timeout: TEST_CONFIG.timeouts.api,
    });
  }

  async getSitemap() {
    return this.request.get(`${URLS.base}${URLS.endpoints.sitemap}`, {
      timeout: TEST_CONFIG.timeouts.api,
    });
  }
}
