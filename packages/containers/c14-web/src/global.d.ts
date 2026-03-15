/* eslint-disable @typescript-eslint/no-explicit-any */
declare module 'jquery';

interface Window {
  $: any;
  jQuery: any;
  __INITIAL_STATE__: Record<string, unknown>;
}
