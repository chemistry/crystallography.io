import { API_BASE_URL } from '../common/config.js';

interface CatalogContentResponse {
  meta: { pages: number };
  structures: number[];
}

interface CatalogResponse {
  meta: { pages: number };
  data: [
    {
      id: number;
      type: string;
      attributes: {
        id: number;
        structures: number[];
      };
    },
  ];
}

export const getCatalogContent = async (pageQ: number): Promise<CatalogContentResponse> => {
  const response = await fetch(`${API_BASE_URL}/api/v1/catalog/?page=${Math.ceil(pageQ / 100)}`, {
    method: 'GET',
  });
  const { data, meta } = (await response.json()) as CatalogResponse;

  let structures: number[] = [];
  if (Array.isArray(data)) {
    const dataItem = data.find((el: { id: number }) => el.id === pageQ);
    structures = dataItem?.attributes.structures || [];
  }
  return {
    meta,
    structures,
  };
};
