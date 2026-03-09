/// <reference types="vite/client" />

declare module '*.svg' {
  const content: string;
  export default content;
}

declare module '@chemistry/molpad' {
  const MolPad: React.ForwardRefExoticComponent<
    React.RefAttributes<{
      isSutableForSearch: () => string;
      getJmol: () => unknown;
    }>
  >;
  export { MolPad };
}
