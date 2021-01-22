import * as React from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { PageContainer } from "../layout";
import { useInBrowser } from "../services";
import { RootState } from "../store";
import { AuthorsList, CompoundName } from "../utils";
import { useEffect } from "react";

if (process.env.BROWSER) {
    // tslint:disable-next-line
    require("./details.scss");
}

export const DetailsPage = () => {

    // Is page Loading
    const isLoading = useSelector((state: RootState) => state.detailsPage.isLoading);
    const structure: any = useSelector((state: RootState) => state.detailsPage.data.details);

    const { id } = useParams() as any;
    const currentId = parseInt(id, 10);

    const HeadComponent: React.SFC = () => {
        return (<span>Crystal Structure of <CompoundName model={structure} /></span>);
    };

    if (!currentId || !isFinite(currentId)) {
        return (
            <PageContainer title={"Crystal Structure Details"}>
                <h2 className="text-primary">
                    Wrong structure Id: <span className="text-error">{id}</span>
                </h2>
            </PageContainer>
        );
    }

    useInBrowser(() => {
        const { Mol3DView } = require('@chemistry/crystalview');
        let viewer = new Mol3DView({
            bgcolor: "#212529"
        });
        const element = document.getElementById('viewer');
        viewer.append(element);
        viewer.onInit();

        if (structure) {
            try {
                viewer.load(structure);
            // tslint:disable-next-line
            } catch (e) { }
        }
        return () => {
            if (viewer) {
                element.innerHTML = '<div></div>';
                viewer.onDestroy();
                viewer = null;
            }
        }
    }, [structure]);



    return (
        <PageContainer HeadComponent={HeadComponent}>
            <div className="columns">
                <div className="column col-md-12 col-7">
                    <div className="c-square">
                        <div className="c-content" id="viewer"></div>
                    </div>
                </div>
                <div className="column col-md-5 col-5">
                <table className="table">
                    <tbody>
                            {structure.id ?
                                <tr><td className="text-bold">Id</td>
                                <td><span>{structure.id}</span></td></tr> : null
                            }
                            {structure.commonname ?
                                <tr><td className="text-bold">Common name</td>
                                <td><span>{structure.commonname}</span></td></tr> : null
                            }
                            {structure.chemname ?
                                 <tr><td className="text-bold">Chemical name</td>
                                 <td><span>{structure.chemname}</span></td></tr> : null
                            }
                            {structure.mineral ?
                                <tr><td className="text-bold">Mineral name</td>
                                <td><span>{structure.mineral}</span></td></tr> : null
                            }
                            {structure.a ?
                                <tr><td className="text-bold">a (&Aring;)</td>
                                <td>{structure.a}</td></tr> : null
                            }
                            {structure.b ?
                                <tr><td className="text-bold">b (&Aring;)</td>
                                <td>{structure.b}</td></tr> : null
                            }
                            {structure.c ?
                                <tr><td className="text-bold">c (&Aring;)</td>
                                <td>{structure.c}</td></tr> : null
                            }
                            {structure.alpha ?
                                <tr><td className="text-bold">&alpha; (&deg;)</td>
                                <td>{structure.alpha}</td></tr> : null
                            }
                            {structure.beta ?
                                <tr><td className="text-bold">&beta; (&deg;)</td>
                                <td>{structure.beta}</td></tr> : null
                            }
                            {structure.gamma ?
                                <tr><td className="text-bold">&gamma; (&deg;)</td>
                                <td>{structure.gamma}</td></tr> : null
                            }
                            {structure.vol ?
                                <tr><td className="text-bold">V (&Aring;<sup>3</sup>)</td>
                                <td>{structure.vol}</td></tr> : null
                            }
                            {structure.sg ?
                                <tr><td className="text-bold">Space group</td>
                                <td>{structure.sg}</td></tr> : null
                            }
                            {structure.diffrtemp ?
                                <tr><td className="text-bold">Temperature (K)</td>
                                <td>{structure.diffrtemp}</td></tr> : null
                            }
                            {structure.Robs ?
                                <tr><td className="text-bold">R<sub>int</sub></td>
                                <td>{structure.Robs}</td></tr> : null
                            }
                        </tbody>
                    </table>

                    </div>
                </div>
                <div className="c-details-page__publication">
                    {
                        structure.__authors ?
                        <div className="c-details-page__authors c-details-page__pub_item">
                            <span className="text-bold">Authors:</span>&nbsp;
                            <span><AuthorsList model={structure} /></span>
                        </div>: null
                    }
                    {
                        structure.articleHtml ?
                        <div className="c-details-page__pub_item">
                            <span className="text-bold">Publication:</span>&nbsp;
                            <span dangerouslySetInnerHTML={{__html: structure.articleHtml}}></span>
                        </div> : null
                    }
                    {
                        structure.doi ?
                        <div className="c-details-page__pub_item">
                            <span className="text-bold">Link:</span>&nbsp;
                            <a rel="nofollow" target="_blank" href={`//dx.doi.org/${structure.doi}`}>Article</a>
                        </div> : null
                    }
                </div>
        </PageContainer>
    );
};
