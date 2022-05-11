import * as React from "react";
import { NavLink } from "react-router-dom";
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

export const JournalName: React.SFC<{ model: StructureModel }> = ({ model }) => {
  const nameTags: JSX.Element[] = [];
  const journal = model?.journal;
  if (journal || journal.year) {
      if (journal.journal) {
        nameTags.push(<i>{journal.journal + ' '}</i>);
      }
      if (journal.year) {
        nameTags.push(<b>({journal.year + ') '}</b>);
      }

      if (journal.volume) {
        nameTags.push(<>{journal.volume + ", "}</>);
      }

      if (journal.issue) {
        nameTags.push(<>{journal.issue + ' '}</>);
      }

      if (journal.firstpage || journal.lastpage) {
          let f = journal.firstpage || "";
          if (journal.lastpage) {
              f += "-" + journal.lastpage;
          }
          nameTags.push(<>{f}</>);
      }

      return <>{nameTags}</>;
  }

  return <></>;
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
  const authors = model?.journal?.authors;
  if (!authors || !Array.isArray(authors) || authors.length === 0) {
      return (<span></span>);
  }
  return (<span>{authors.map(getAuthorDetails)}</span>);
}
