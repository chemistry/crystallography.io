import * as React from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { PageContainer } from "../layout";
import { useInBrowser } from "../services";
import { RootState } from "../store";
import { AuthorsList, CompoundName } from "../utils";

if (process.env.BROWSER) {
    // tslint:disable-next-line
    require("./details.scss");
}

const DownloadIcon = ()=> {
    // tslint:disable-next-line
    return (<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M11.6375 7.37763L8.91195 10.4088C8.68005 10.6685 8.34651 10.8168 7.99817 10.8168C7.65081 10.8168 7.31728 10.6685 7.08242 10.4078L4.34996 7.35375C4.07662 7.04725 4.10129 6.57457 4.40424 6.29892C4.70719 6.02327 5.17493 6.04715 5.44926 6.35365L7.25807 8.37574V0.746129C7.25807 0.334148 7.58963 -0.000213623 7.99817 -0.000213623C8.40769 -0.000213623 8.73827 0.334148 8.73827 0.746129V8.37972L10.5402 6.37455C10.8155 6.07004 11.2832 6.04616 11.5862 6.3238C11.8891 6.60044 11.9128 7.07114 11.6375 7.37763ZM14.5197 13.7647V9.51954C14.5197 9.10656 14.8512 8.7732 15.2598 8.7732C15.6683 8.7732 15.9999 9.10656 15.9999 9.51954V13.7647C15.9999 14.9987 15.0081 15.9998 13.7835 15.9998H2.21623C0.9926 15.9998 -0.00012207 14.9987 -0.00012207 13.7647V9.51954C-0.00012207 9.10656 0.331443 8.7732 0.739979 8.7732C1.14851 8.7732 1.48008 9.10656 1.48008 9.51954V13.7647C1.48008 14.1747 1.80967 14.5071 2.21623 14.5071H13.7835C14.1901 14.5071 14.5197 14.1747 14.5197 13.7647Z" fill="white"/></svg>
    );
}

export const DetailsPage = () => {

    // Is page Loading
    const isLoading = useSelector((state: RootState) => state.detailsPage.isLoading);
    const structure: any = useSelector((state: RootState) => state.detailsPage.data.details);

    const { id } = useParams() as any;
    const currentId = parseInt(id, 10);

    const HeadComponent = () => {
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
                    <div className="c-details-page__pub_item">
                        {
                            structure.doi ? <a rel="nofollow" target="_blank" href={`//dx.doi.org/${structure.doi}`} className="btn btn-active input-inline c-details-page__doi_link">Article</a> : null
                        }
                        <a rel="nofollow" target="_blank" href={`/cif/${structure.id}`}
                            className="btn btn-active input-inline" download><DownloadIcon />&nbsp;Download CIF</a>
                     </div>
                </div>
        </PageContainer>
    );
};
