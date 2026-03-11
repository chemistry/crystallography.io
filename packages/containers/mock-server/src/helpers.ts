import type { MockStructure } from './data/structures.js';

export function mapStructure(item: MockStructure, expand: boolean) {
  const base = {
    id: item._id,
    a: item.a,
    b: item.b,
    c: item.c,
    alpha: item.alpha,
    beta: item.beta,
    gamma: item.gamma,
    vol: item.vol,
    commonname: item.commonname,
    chemname: item.chemname,
    mineral: item.mineral,
    formula: item.formula,
    calcformula: item.calcformula,
    __authors: item.__authors,
    title: item.title,
    journal: item.journal,
    year: item.year,
    volume: item.volume,
    issue: item.issue,
    firstpage: item.firstpage,
    lastpage: item.lastpage,
    doi: item.doi,
    articleHtml: buildArticleHtml(item),
    loops: expand ? item.loops : [],
  };

  if (expand) {
    return {
      id: item._id,
      type: 'structure',
      attributes: {
        ...base,
        sg: item.sg,
        diffrtemp: item.diffrtemp,
        Robs: item.Robs,
      },
    };
  }

  return { id: item._id, type: 'structure', attributes: base };
}

function buildArticleHtml(item: MockStructure): string {
  const parts: string[] = [];
  if (item.journal) parts.push(`<i>${item.journal}</i>`);
  if (item.year) parts.push(`(<b>${item.year}</b>)`);
  if (item.volume) parts.push(`${item.volume},`);
  if (item.issue) parts.push(`${item.issue}`);
  if (item.firstpage) {
    parts.push(item.lastpage ? `${item.firstpage}-${item.lastpage}` : `${item.firstpage}`);
  }
  return parts.join(' ');
}
