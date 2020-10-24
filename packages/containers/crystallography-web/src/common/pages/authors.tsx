import * as React from "react";
import { useParams } from "react-router-dom";
import { RouteConfig } from "react-router-config";
import { useLoadedData } from "../services";
import { useSelector } from "react-redux";
import { RootState } from "../store";


export const AuthorsPage = (props: { route: RouteConfig }) => {

    // Page Navigation
    useLoadedData(props.route);

    const { page } = useParams() as any;
    let currentPage = parseInt(page, 10);
    currentPage = currentPage && isFinite(currentPage) ? currentPage : 1;

    const isLoading = useSelector((state: RootState) => state.authorsListPage.isLoading);
    const containerRef = React.useRef(null);

    const authors = useSelector((state: RootState) => {
        return state.authorsListPage.data.authorsList;
    });

    return (
        <div>
            <header className="app-layout-header">
                <h2 className="text-primary">Authors</h2>
            </header>
            <div className="app-layout-content">
                <table className="table table-rounded" style={{width: '50%'}}>
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
                            authors.map((item, idx)=> {
                                const date = item.timestamp ? (new Date(item.timestamp).toLocaleString()): null;
                                return (
                                    <tr key={item.id}>
                                        <td>{idx + 1}</td>
                                        <td>{item.full}</td>
                                        <td>{date}</td>
                                        <td>{item.count}</td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
            </div>
        </div>
    );
}
