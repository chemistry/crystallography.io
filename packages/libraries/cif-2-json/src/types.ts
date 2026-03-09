export interface CifLoop {
  columns: string[];
  data: (string | string[])[];
}

export interface CifDataBlock {
  loop_?: CifLoop[];
  [key: string]: string | CifLoop[] | undefined;
}

export type CifResult = Record<string, CifDataBlock>;
