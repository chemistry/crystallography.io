export interface MockStructure {
  _id: number;
  a: number;
  b: number;
  c: number;
  alpha: number;
  beta: number;
  gamma: number;
  vol: number;
  commonname: string;
  chemname: string;
  mineral: string | null;
  formula: string;
  calcformula: string;
  sg: string;
  diffrtemp: number;
  Robs: number;
  __authors: string[];
  title: string;
  journal: string;
  year: number;
  volume: number;
  issue: number;
  firstpage: number;
  lastpage: number;
  doi: string;
  loops: { columns: string[]; data: string[][] }[];
}

export const structures: MockStructure[] = [
  {
    _id: 1000003,
    a: 4.916,
    b: 4.916,
    c: 5.4054,
    alpha: 90,
    beta: 90,
    gamma: 120,
    vol: 113.01,
    commonname: 'Quartz',
    chemname: 'Silicon dioxide',
    mineral: 'Quartz',
    formula: 'Si O2',
    calcformula: 'O2 Si',
    sg: 'P 32 2 1',
    diffrtemp: 298,
    Robs: 0.035,
    __authors: ['Le Page, Y.', 'Donnay, G.'],
    title: 'Refinement of the crystal structure of low-quartz',
    journal: 'Acta Crystallographica Section B',
    year: 1976,
    volume: 32,
    issue: 8,
    firstpage: 2456,
    lastpage: 2459,
    doi: '10.1107/S0567740876007966',
    loops: [
      {
        columns: [
          '_atom_site_label',
          '_atom_site_type_symbol',
          '_atom_site_fract_x',
          '_atom_site_fract_y',
          '_atom_site_fract_z',
        ],
        data: [
          ['Si1', 'Si', '0.4697', '0.0000', '0.0000'],
          ['O1', 'O', '0.4135', '0.2669', '0.1191'],
        ],
      },
    ],
  },
  {
    _id: 1100015,
    a: 5.64,
    b: 5.64,
    c: 5.64,
    alpha: 90,
    beta: 90,
    gamma: 90,
    vol: 179.41,
    commonname: 'Halite',
    chemname: 'Sodium chloride',
    mineral: 'Halite',
    formula: 'Na Cl',
    calcformula: 'Cl Na',
    sg: 'F m -3 m',
    diffrtemp: 298,
    Robs: 0.022,
    __authors: ['Abrahams, S.C.', 'Bernstein, J.L.'],
    title: 'Accuracy of an automatic diffractometer',
    journal: 'Acta Crystallographica',
    year: 1965,
    volume: 18,
    issue: 5,
    firstpage: 926,
    lastpage: 932,
    doi: '10.1107/S0365110X65002244',
    loops: [
      {
        columns: [
          '_atom_site_label',
          '_atom_site_type_symbol',
          '_atom_site_fract_x',
          '_atom_site_fract_y',
          '_atom_site_fract_z',
        ],
        data: [
          ['Na1', 'Na', '0.0000', '0.0000', '0.0000'],
          ['Cl1', 'Cl', '0.5000', '0.5000', '0.5000'],
        ],
      },
    ],
  },
  {
    _id: 1200016,
    a: 3.567,
    b: 3.567,
    c: 3.567,
    alpha: 90,
    beta: 90,
    gamma: 90,
    vol: 45.38,
    commonname: 'Diamond',
    chemname: 'Carbon',
    mineral: 'Diamond',
    formula: 'C',
    calcformula: 'C',
    sg: 'F d -3 m',
    diffrtemp: 298,
    Robs: 0.018,
    __authors: ['Bragg, W.H.', 'Bragg, W.L.'],
    title: 'The structure of the diamond',
    journal: 'Proceedings of the Royal Society A',
    year: 1913,
    volume: 89,
    issue: 610,
    firstpage: 277,
    lastpage: 291,
    doi: '10.1098/rspa.1913.0084',
    loops: [
      {
        columns: [
          '_atom_site_label',
          '_atom_site_type_symbol',
          '_atom_site_fract_x',
          '_atom_site_fract_y',
          '_atom_site_fract_z',
        ],
        data: [['C1', 'C', '0.0000', '0.0000', '0.0000']],
      },
    ],
  },
  {
    _id: 1300042,
    a: 5.4305,
    b: 5.4305,
    c: 5.4305,
    alpha: 90,
    beta: 90,
    gamma: 90,
    vol: 160.18,
    commonname: 'Silicon',
    chemname: 'Silicon',
    mineral: null,
    formula: 'Si',
    calcformula: 'Si',
    sg: 'F d -3 m',
    diffrtemp: 295,
    Robs: 0.012,
    __authors: ['Batchelder, D.N.', 'Simmons, R.O.'],
    title: 'Lattice constants and thermal expansivities of silicon and calcium fluoride',
    journal: 'The Journal of Chemical Physics',
    year: 1964,
    volume: 41,
    issue: 8,
    firstpage: 2324,
    lastpage: 2329,
    doi: '10.1063/1.1726266',
    loops: [
      {
        columns: [
          '_atom_site_label',
          '_atom_site_type_symbol',
          '_atom_site_fract_x',
          '_atom_site_fract_y',
          '_atom_site_fract_z',
        ],
        data: [['Si1', 'Si', '0.0000', '0.0000', '0.0000']],
      },
    ],
  },
  {
    _id: 1500065,
    a: 4.759,
    b: 4.759,
    c: 12.991,
    alpha: 90,
    beta: 90,
    gamma: 120,
    vol: 254.87,
    commonname: 'Calcite',
    chemname: 'Calcium carbonate',
    mineral: 'Calcite',
    formula: 'Ca C O3',
    calcformula: 'C Ca O3',
    sg: 'R -3 c',
    diffrtemp: 298,
    Robs: 0.019,
    __authors: ['Maslen, E.N.', 'Streltsov, V.A.', 'Streltsova, N.R.'],
    title: 'X-ray study of the electron density in calcite',
    journal: 'Acta Crystallographica Section B',
    year: 1993,
    volume: 49,
    issue: 4,
    firstpage: 636,
    lastpage: 641,
    doi: '10.1107/S0108768193002575',
    loops: [
      {
        columns: [
          '_atom_site_label',
          '_atom_site_type_symbol',
          '_atom_site_fract_x',
          '_atom_site_fract_y',
          '_atom_site_fract_z',
        ],
        data: [
          ['Ca1', 'Ca', '0.0000', '0.0000', '0.0000'],
          ['C1', 'C', '0.0000', '0.0000', '0.2500'],
          ['O1', 'O', '0.2573', '0.0000', '0.2500'],
        ],
      },
    ],
  },
  {
    _id: 1600088,
    a: 8.394,
    b: 12.996,
    c: 7.151,
    alpha: 90,
    beta: 116.34,
    gamma: 90,
    vol: 699.23,
    commonname: 'Gypsum',
    chemname: 'Calcium sulfate dihydrate',
    mineral: 'Gypsum',
    formula: 'Ca S O4 (H2 O)2',
    calcformula: 'Ca H4 O6 S',
    sg: 'I 1 2/a 1',
    diffrtemp: 298,
    Robs: 0.028,
    __authors: ['Cole, W.F.', 'Lancucki, C.J.'],
    title: 'A refinement of the crystal structure of gypsum',
    journal: 'Acta Crystallographica Section B',
    year: 1974,
    volume: 30,
    issue: 4,
    firstpage: 921,
    lastpage: 929,
    doi: '10.1107/S0567740874004055',
    loops: [
      {
        columns: [
          '_atom_site_label',
          '_atom_site_type_symbol',
          '_atom_site_fract_x',
          '_atom_site_fract_y',
          '_atom_site_fract_z',
        ],
        data: [
          ['Ca1', 'Ca', '0.5000', '0.0794', '0.2500'],
          ['S1', 'S', '0.0000', '0.0766', '0.7500'],
          ['O1', 'O', '0.0184', '0.1325', '0.5488'],
          ['O2', 'O', '0.1609', '0.0273', '0.8731'],
        ],
      },
    ],
  },
];

export const structureIds = structures.map((s) => s._id);
