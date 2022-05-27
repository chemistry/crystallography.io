export interface StructureModel {
  id: string;
  a: string;
  b: string;
  c: string;
  alpha: string;
  beta: string;
  gamma: string;
  vol: string;
  z: string;
  diffrtemp: string;
  diffrpressure: string;
  sg: string;
  sgHall: string;
  radType: string;
  wavelength: string;
  commonname: string;
  chemname: string;
  mineral: string;
  formula: string;
  calcformula: string;
  iupacformula: string;
  Rall: string;
  Robs: string;
  Rref: string;
  wRall: string;
  wRobs: string;
  wRref: string;
  journal: {
    title: string;
    authors: {name: string, link: string}[];
    journal: string;
    year: string;
    volume: string;
    issue: string;
    firstpage: string;
    lastpage: string;
    doi: string;
  }
}