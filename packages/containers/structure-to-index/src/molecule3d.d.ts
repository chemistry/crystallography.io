declare module '@chemistry/molecule3d' {
  interface Molecule3D {
    load(doc: unknown): void;
    getAtomsCount(): number;
    isOrganic(): boolean;
    addAtomLayers(layers: number, maxAtoms: number): void;
    export(): unknown;
    destroy(): void;
  }

  interface Molecule3DConstructor {
    new (): Molecule3D;
  }

  const mod: { Molecule3D: Molecule3DConstructor };
  export default mod;
}
