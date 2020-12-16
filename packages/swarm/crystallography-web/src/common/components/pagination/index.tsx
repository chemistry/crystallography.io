import * as React from "react";
import { NavLink } from "react-router-dom";

if (process.env.BROWSER) {
    // tslint:disable-next-line
    require("./index.scss");
}

export const Pagination: React.SFC<{ currentPage: number, maxPages: number, totalPages: number, url: string }> = ({
    currentPage, maxPages, totalPages, url
}) => {
    if (totalPages < 1) {
        return null;
    }

    // calculate pages to show
    const pagesToShow = Math.min(maxPages, totalPages);

    let from = Math.max(1, currentPage - Math.floor(pagesToShow / 2));
    let to = Math.min(currentPage + Math.ceil(pagesToShow / 2), totalPages);

    if (to - maxPages > 1) {
        from = Math.min(from, to - maxPages);
    }
    to = Math.min(from + maxPages - 1, totalPages);

    const pagesNum = [];
    for (let i = from; i <= to; i++) {
        pagesNum.push(i);
    }
    if (pagesNum.length === 1) {
        return null;
    }

    const pageLinkTemplate = (pageNum: number) => {
        return (
            <NavLink to={ url + "/" + pageNum} className="c-page-link">{pageNum}</NavLink>
        );
    };

    const pageItems = pagesNum.map((pageNum) => {
        const isActive = (pageNum === currentPage);
        const className = isActive ? "c-page-item active" : "c-page-item";
        return (<li className={className} key={pageNum}>{pageLinkTemplate(pageNum)}</li>);
    });

    return (
        <div className="c-pagination"><ul className="c-pagination-list">{pageItems}</ul></div>
    );
};
