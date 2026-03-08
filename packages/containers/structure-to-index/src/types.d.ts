declare module '@chemistry/molecule3d' {
  export class Molecule3D {
    static fromCIF(data: Record<string, unknown>): Molecule3D;
    bonds: { from: number; to: number }[];
  }
  export default { Molecule3D };
}
