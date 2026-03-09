declare module 'react-router-dom/server' {
  import type * as React from 'react';
  interface StaticRouterProps {
    basename?: string;
    children?: React.ReactNode;
    location: string | Partial<Location>;
    future?: Record<string, boolean>;
  }

  function StaticRouter(props: StaticRouterProps): React.JSX.Element;

  export { StaticRouter };
  export type { StaticRouterProps };
}
