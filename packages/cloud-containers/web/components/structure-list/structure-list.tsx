import React from "react";
import { NavLink } from "react-router-dom";
import { StructureModel } from "../../models";
import { CompoundFormula, CompoundName, AuthorsList } from "../../utils";

const DownloadIcon = ()=> {
    // tslint:disable-next-line
    return (<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M11.6376 7.3776L8.91207 10.4088C8.68017 10.6685 8.34663 10.8168 7.99829 10.8168C7.65094 10.8168 7.3174 10.6685 7.08254 10.4078L4.35009 7.35372C4.07674 7.04722 4.10141 6.57454 4.40436 6.29889C4.70731 6.02324 5.17505 6.04712 5.44938 6.35362L7.25819 8.37571V0.746099C7.25819 0.334117 7.58976 -0.000244141 7.99829 -0.000244141C8.40781 -0.000244141 8.73839 0.334117 8.73839 0.746099V8.37969L10.5403 6.37452C10.8156 6.07001 11.2834 6.04613 11.5863 6.32377C11.8892 6.60041 11.9129 7.07111 11.6376 7.3776ZM14.5198 13.7647V9.51951C14.5198 9.10653 14.8514 8.77317 15.2599 8.77317C15.6684 8.77317 16 9.10653 16 9.51951V13.7647C16 14.9987 15.0083 15.9998 13.7836 15.9998H2.21636C0.992722 15.9998 0 14.9987 0 13.7647V9.51951C0 9.10653 0.331565 8.77317 0.740101 8.77317C1.14864 8.77317 1.4802 9.10653 1.4802 9.51951V13.7647C1.4802 14.1747 1.80979 14.5071 2.21636 14.5071H13.7836C14.1902 14.5071 14.5198 14.1747 14.5198 13.7647Z" fill="#4285F4"/>
        </svg>
    );
}

export const StructuresList = ({ list }: { list: StructureModel[]}) => {
    return (
        <div className="c-structure-list">{
            list.map((item) => {
                return (
                    <div className="c-structure-list-item" key={item.id}>
                        <h2  className="c-structure-list-item__name">
                            <NavLink to={`/structure/${item.id}`}>
                                <CompoundName model={item} />
                            </NavLink>
                        </h2>
                        <a rel="nofollow" target="_blank" href={`/cif/${item.id}`}
                            className="c-structure-list-item__cif_download" download><DownloadIcon /></a>
                        <p className="c-structure-list-item__formula">
                            <CompoundFormula model={item} />
                        </p>
                        <p className="c-structure-list-item__authors">
                            <AuthorsList model={item} />
                        </p>
                        <p className="c-structure-list-item__journal">{
                            item.articleHtml ? (<span dangerouslySetInnerHTML={{__html: item.articleHtml}} />) : ""
                        }</p>
                        <p className="c-structure-list-item__unit-cell">
                            <b>a</b>={item.a}Å&nbsp;&nbsp;&nbsp;<b>b</b>={item.b}Å&nbsp;&nbsp;&nbsp;<b>c</b>={item.c}Å
                        </p>
                        <p className="c-structure-list-item__unit-cell">
                            <b>α</b>={item.alpha}°&nbsp;&nbsp;&nbsp;<b>β</b>={item.beta}°&nbsp;&nbsp;&nbsp;<b>γ</b>={item.gamma}°
                        </p>
                    </div>
                );
            })
        }</div>
    );
};
