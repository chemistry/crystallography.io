import * as React from "react";
import { StructureModel } from "../models";

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
