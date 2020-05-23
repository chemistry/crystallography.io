import * as React from "react";

export const SearchPage = () => {
  return (
    <>
      <h1 className="text-primary">Application Styling</h1>
      <hr />
        <h2 className="text-primary">Buttons</h2>
        <div className="p-2 m-2">
            <button className="btn">default button</button>&nbsp;
            <button className="btn btn-primary">primary button</button>&nbsp;
            <button className="btn btn-link">link button</button>&nbsp;
        </div>
        <div className="p-2 m-2">
          <button className="btn btn-active">active button</button>&nbsp;
          <button className="btn btn-success">success button</button>&nbsp;
          <button className="btn btn-error">error button</button>&nbsp;
          <button className="btn btn-warning">warning button</button>
        </div>
        <div className="p-2 m-2">
            <button className="btn btn-primary disabled">primary disabled</button>&nbsp;
            <button className="btn disabled">default disabled</button>&nbsp;
        </div>
        <div className="p-2 m-2">
            <button className="btn loading">button</button>&nbsp;
            <button className="btn btn-primary loading">primary button</button>
        </div>
      <hr/>
      <h2 className="text-primary">Headings</h2>
      <h1>Headline 1</h1>
      <h2>Headline 2</h2>
      <h3>Headline 3</h3>
      <h4>Headline 4</h4>
      <h5>Headline 5</h5>
      <h6>Headline 6</h6>
      <p>Default Paragraph - body1</p>
      <hr />
        <h2 className="text-primary">Badges</h2>
        <p><span className="text-primary p-1">primary color</span></p>
        <p><span className="text-secondary p-1">secondary color</span></p>
        <p><span className="text-additional p-1">additional color</span></p>
        <p><span className="text-dark p-1">dark color</span></p>
        <p><span className="text-gray p-1">gray color</span></p>
        <p><span className="text-light p-1">light color</span></p>
        <p><span className="text-active p-1">active color</span></p>
        <p><span className="text-success p-1">success color</span></p>
        <p><span className="text-warning p-1">warning color</span></p>
        <p><span className="text-error p-1">error color</span></p>

        <p><span className="bg-primary p-1">primary bg</span></p>
        <p><span className="bg-secondary p-1">secondary bg</span></p>
        <p><span className="bg-additional p-1">additional color</span></p>
        <p><span className="bg-dark p-1">dark bg</span></p>
        <p><span className="bg-default p-1">default bg</span></p>
        <p><span className="bg-active p-1">active bg</span></p>
        <p><span className="bg-success p-1">success bg</span></p>
        <p><span className="bg-warning p-1">warning bg</span></p>
        <p><span className="bg-error p-1">error bg</span></p>
      <hr/>
      <h2 className="text-primary">Lists</h2>
      <ul>
        <li>list item 1</li>
        <li>list item 2
          <ul>
            <li>list item 2.1</li>
            <li>list item 2.2</li>
            <li>list item 2.3</li>
          </ul>
        </li>
        <li>list item 3</li>
      </ul>
      <hr />
    </>
  );
};
