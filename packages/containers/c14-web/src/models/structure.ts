const getStructuresData = async (ids: number[]) => {
  const response = await fetch(`https://crystallography.io/api/v1/structure`, {
    method: 'POST',
    body: `ids=[${ids.join(',')}]`,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
  const res = await response.json();
  return res.data;
};

const _difference = (arr1: number[], arr2: number[]) => {
  return arr1.filter((x) => !arr2.includes(x));
};

interface StructureResponse {
  data: { id: string; attributes: Record<string, unknown> }[];
}

export const getStructures = async (ids: number[]): Promise<StructureResponse> => {
  if (ids.length === 0) {
    return { data: [] };
  }
  const data = await getStructuresData(ids);
  return {
    data,
  };
};
