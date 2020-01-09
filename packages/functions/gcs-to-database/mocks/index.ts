const fs: any = jest.requireActual("fs");

export const STRUCTURE_1000004 = fs.readFileSync(`${__dirname}/data/1000004.cif`).toString();
