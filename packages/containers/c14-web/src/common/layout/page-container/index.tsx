import type { FC, PropsWithChildren } from 'react';

export const PageContainer: FC<PropsWithChildren<{ title?: string; HeadComponent?: FC }>> = ({
  title,
  children,
  HeadComponent,
}) => {
  return (
    <div>
      <header className="app-layout-header">
        <h2 className="text-primary">
          {title ? title : null}
          {HeadComponent ? <HeadComponent /> : null}
        </h2>
      </header>
      <div className="app-layout-content">
        <div className="app-layout-page">{children}</div>
      </div>
    </div>
  );
};
