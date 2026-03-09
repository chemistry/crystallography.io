export interface StructureModel {
  id: string;
  a: string;
  b: string;
  c: string;
  alpha: string;
  beta: string;
  gamma: string;
  vol: string;

  commonname: string;
  chemname: string;
  mineral: string;
  formula: string;
  calcformula: string;

  title: string;
  journal: string;
  year: string;
  volume: string;
  issue: string;
  firstpage: string;
  lastpage: string;
  doi: string;
  articleHtml: string;
  sg: string;
  diffrtemp: string;
  Robs: string;
  loops: Record<string, string[]>[];

  __authors: { name: string; link: string }[];
}
