import * as React from "react";

export const PageContainer: React.SFC<{ title?: string, HeadComponent?: React.SFC }> = ({
    title, children, HeadComponent,
}) => {
    return (
        <div>
            <header className="app-layout-header">
                <h2 className="text-primary">{title ? title : null}{HeadComponent ? <HeadComponent/> : null }</h2>
            </header>
            <div className="app-layout-content">
                <div className="app-layout-page">
                    {children}
                </div>
            </div>
        </div>
    );
};
