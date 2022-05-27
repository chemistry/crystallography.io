import * as React from "react";

export const PageContainer = ({title, children, HeadComponent}: {
    title: string, children: React.ReactNode, HeadComponent: React.FunctionComponent
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
}
