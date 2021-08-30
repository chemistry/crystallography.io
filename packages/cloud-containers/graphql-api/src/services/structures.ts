import { Db } from 'mongodb';

export const getStructures = async ({page}: {page: string}, {db}: {db: Db})=> {
  const pageContent = await db.collection('catalog').findOne({_id: parseInt(page, 10) });

  let data: any = [];
  if (pageContent && Array.isArray(pageContent.structures)) {
    const structureIds = pageContent.structures;
    const structures = await db.collection('structures').find({_id: {$in: structureIds}}).toArray();
    if (structures) {
      data = structures;
    }
  }
  return data;
}
