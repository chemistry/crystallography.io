import * as React from "react";

export const PageContainer: React.SFC<{ title: string }> = ({
    title, children,
}) => {
    return (
        <div>
            <header className="app-layout-header">
                <h2 className="text-primary">{title}</h2>
            </header>
            <div className="app-layout-content">
                <div className="app-layout-page">
                    {children}
                </div>
            </div>
        </div>
    );
};
