import * as React from "react";
import { useSelector } from "react-redux";
import { RouteConfig } from "react-router-config";
import { useParams } from "react-router-dom";
import { PageContainer } from "../layout";
import { useLoadedData } from "../services";
import { RootState } from "../store";

if (process.env.BROWSER) {
    // tslint:disable-next-line
    require("./details.scss");
}

export const DetailsPage = (props: { route: RouteConfig }) => {

    // Page Navigation
    useLoadedData(props.route);

    // Is page Loading
    const isLoading = useSelector((state: RootState) => state.detailsPage.isLoading);
    const structure = useSelector((state: RootState) => state.detailsPage.data.details);

    const { id } = useParams();
    const currentId = parseInt(id, 10);
    if (!currentId || !isFinite(currentId)) {
        return (
            <PageContainer title={"Crystal Structure Details"}>
                <h2 className="text-primary">
                    Wrong structure Id: <span className="text-error">{id}</span>
                </h2>
            </PageContainer>
        );
    }

    return (
        <PageContainer title={"Crystal Structure of"}>
                <div className="columns">
                    <div className="column col-7">
                    <div className="c-square">
                        <div className="c-content"></div>
                    </div>
                    </div>
                    <div className="column col-5">
                        <pre>
                            {JSON.stringify(structure, null, 4)}
                        </pre>
                    </div>
                </div>
                <div className="">Authors</div>
        </PageContainer>
    );
};
