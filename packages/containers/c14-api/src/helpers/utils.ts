const structureCommonAttributes = [
  'a',
  'b',
  'c',
  'alpha',
  'beta',
  'gamma',
  'vol',
  'commonname',
  'chemname',
  'mineral',
  'formula',
  'calcformula',
  '__authors',
];

const structureCommonAttributesDetails = [
  'diffrtemp',
  'diffrpressure',
  'sg',
  'sgHall',
  'radType',
  'wavelength',
  'Rall',
  'Robs',
  'Rref',
  'wRall',
  'wRobs',
  'wRref',
  'loops',
];

const structureCommonCalcAttributes = [
  'title',
  'journal',
  'year',
  'volume',
  'issue',
  'firstpage',
  'lastpage',
  'doi',
];

export function getStructureAttributes(expand: boolean = false): string[] {
  let res = [...structureCommonAttributes, ...structureCommonCalcAttributes];
  if (expand) {
    res = [...res, ...structureCommonAttributesDetails];
  }

  return res;
}

export function mapStructure(expand: boolean = false) {
  const attributes = getStructureAttributes(expand);

  return (item: Record<string, unknown>) => {
    const itemFilted = attributes.reduce(
      (acc: Record<string, unknown>, attr: string) => {
        if (Object.prototype.hasOwnProperty.call(item, attr)) {
          acc[attr] = item[attr];
        }
        return acc;
      },
      {} as Record<string, unknown>
    );

    if (Object.keys(item).length === 1) {
      return {
        id: item._id,
        type: 'structure',
        attributes: null,
      };
    }

    return {
      id: item._id,
      type: 'structure',
      attributes: {
        ...itemFilted,
        id: item._id,
        articleHtml: getarticleHtml(item),
        loops: expand ? filterLoopArray(item.loops) : [],
      },
    };
  };
}

function filterLoopArray(loops: unknown) {
  if (!Array.isArray(loops)) {
    return [];
  }
  return loops.filter((item: Record<string, unknown>) => {
    return (item.columns as string[]).indexOf('_atom_site_fract_x') !== -1;
  });
}

function getarticleHtml(item: Record<string, unknown>): string {
  if (item.journal || item.year) {
    const nameTags = [];

    if (item.journal) {
      nameTags.push('<i>' + item.journal + '</i>');
    }

    if (item.year) {
      nameTags.push('(<b>' + item.year + '</b>)');
    }

    if (item.volume) {
      nameTags.push(item.volume + ',');
    }

    if (item.issue) {
      nameTags.push(item.issue);
    }

    if (item.firstpage || item.lastpage) {
      let f = item.firstpage || '';
      if (item.lastpage) {
        f += '-' + item.lastpage;
      }
      nameTags.push(f);
    }

    return nameTags.join(' ');
  }

  return '';
}
