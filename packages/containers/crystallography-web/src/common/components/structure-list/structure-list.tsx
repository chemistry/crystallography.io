import React from "react";
import { NavLink } from "react-router-dom";
import { StructureModel } from "../../models";
import { CompoundFormula, CompoundName } from "../../utils";

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
                        <p className="c-structure-list-item__formula">
                            <CompoundFormula model={item} />
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
