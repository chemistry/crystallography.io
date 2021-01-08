import * as React from "react";
import { useParams } from "react-router-dom";
import { RouteConfig } from "react-router-config";
import { useLoadedData } from "../services";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { Loader } from "../components/loader";
import { Pagination } from "../components/pagination";


const formatDate = (date: Date): string => {
    const dayOfMonth = `${date.getDate() < 9 ? '0': ''}${date.getDate()}`;
    const month =  `${date.getMonth() < 9 ? '0': ''}${date.getMonth() + 1}`;
    return `${dayOfMonth}.${month}.${date.getFullYear()}`;
}

interface AuthorsRecord {
    index: number;
    full: string;
    count: number;
    updated: string;
    created: number;
}

const AuthorsTable = ({ authors }: {authors: AuthorsRecord[] }) => {
    if (authors.length === 0) {
        return null;
    }
    return (
        <table className="table table-rounded">
            <thead>
                    <tr>
                        <td></td>
                        <td>Name</td>
                        <td>Updated</td>
                        <td>Records</td>
                    </tr>
            </thead>
            <tbody>
                {
                    authors.map((item)=> {
                        const date = item.updated ? formatDate(new Date(item.updated)): null;
                        return (
                            <tr key={item.index}>
                                <td>{item.index}</td>
                                <td>{item.full}</td>
                                <td>{date}</td>
                                <td>{item.count}</td>
                            </tr>
                        )
                    })
                }
            </tbody>
        </table>
    )
}

const numberWithSpaces = (x: number): string => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

export const AuthorsPage = (props: { route: RouteConfig }) => {

    // Page Navigation
    useLoadedData(props.route);

    const { page } = useParams() as any;
    let currentPage = parseInt(page, 10);
    currentPage = currentPage && isFinite(currentPage) ? currentPage : 1;

    const isLoading = useSelector((state: RootState) => state.authorsListPage.isLoading);
    const containerRef = React.useRef(null);

    const { total, pages } = useSelector((state: RootState)=> state.authorsListPage.meta);

    const authors: AuthorsRecord[] = useSelector((state: RootState) => {
        return state.authorsListPage.data.authorsList;
    }).map((res, index)=> {
        return {
            index: index + 1,
            ...res
        }
    });

    const split = Math.ceil(authors.length / 2);
    const authors1 = authors.slice(0, split);
    const authors2 = authors.slice(split);

    return (
        <div>
            <header className="app-layout-header">
                <h2 className="text-primary">Authors</h2>
            </header>
            <div className="app-layout-content">
                <div className="columns">
                    <div className="column col-10">
                        <h4 className="text-primary">{ total ? `Total: ${numberWithSpaces(total)}`: null }</h4>
                    </div>
                </div>

                <Loader isVisible={isLoading} scrollElement={containerRef}>
                    <div className="columns">
                        <div className="column col-md-12 col-5">
                            <AuthorsTable authors={authors1} />
                        </div>
                        <div className="column col-md-12 col-5">
                            <AuthorsTable authors={authors2} />
                        </div>
                    </div>

                    <div className="columns">
                        <div className="column col-10">
                            <Pagination currentPage={currentPage} maxPages={10} totalPages={pages}  url={'/authors'} />
                        </div>
                    </div>
                </Loader>
            </div>
        </div>
    );
}
