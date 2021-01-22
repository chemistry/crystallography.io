import * as React from "react";
import { StructureModel } from "../models";
import { NavLink } from "react-router-dom";

export type HighlightFunction = (name: string) => string;

const CapitalizeFirstLetter = (name: string): string => {
    return name.charAt(0).toUpperCase() + name.slice(1);
};

export const CompoundName: React.SFC<{ model: StructureModel, highlight?: HighlightFunction }> = ({ model, highlight}) => {
    const compoundName = model.commonname || model.chemname || model.mineral;
    if (highlight && compoundName) {
        return (<span>CapitalizeFirstLetter(highlight(compoundName))</span>);
    }
    if (!compoundName && (model.formula || model.calcformula)) {
        return <CompoundFormula model={model} />;
    }

    return (
        <span>{ compoundName ? CapitalizeFirstLetter(compoundName) : "" || model.id}</span>
    );
};

export const CompoundFormula: React.SFC<{ model: StructureModel }> = ({ model }) => {
    let formula = model.formula || model.calcformula || '';
    formula = formula.replace(/[-\s+]/g, "");
    formula = formula.replace(/([\])a-zA-Z])([.,0-9]+)/g, (match, p1, p2) => {
        return p1 + "<sub>" + p2 + "</sub>";
    });
    return (<span dangerouslySetInnerHTML={{ __html: formula }}></span>);
};

const getAuthorDetails = (author: { name: string; link: string }, i: number, arr: any)=> {
    if (!author || !author.name) {
        return '';
    }
    if (author.link) {
        const authorUrl = '/author/' + encodeURIComponent(author.link);
        const authorName = author.name;
        return (<NavLink to={authorUrl} title={author.name} key={i}>{authorName}</NavLink>);
    }
    return (<span key={i}>{author.name}</span>);
}

export const AuthorsList: React.SFC<{ model: StructureModel }> = ({ model }) => {
    if (!model.__authors || !Array.isArray(model.__authors) || model.__authors.length === 0) {
        return (<span></span>);
    }
    return (<span>{model.__authors.map(getAuthorDetails)}</span>);
}
