import * as React from "react";

export const SearchPage = () => {
  return (
    <>
      <h1>Typography</h1>
      <hr/>
      <h1>Headline 1</h1>
      <h2>Headline 2</h2>
      <h3>Headline 3</h3>
      <h4>Headline 4</h4>
      <h5>Headline 5</h5>
      <h6>Headline 6</h6>
      <p>Default Paragraph - body1</p>
      <hr />
      <p><span className="text-primary p-1">primary color</span></p>
      <p><span className="text-secondary p-1">secondary color</span></p>
      <p><span className="text-dark p-1">dark color</span></p>
      <p><span className="text-gray p-1">gray color</span></p>
      <p><span className="text-light p-1">light color</span></p>
      <p><span className="text-active p-1">active color</span></p>
      <p><span className="text-success p-1">success color</span></p>
      <p><span className="text-warning p-1">warning color</span></p>
      <p><span className="text-error p-1">error color</span></p>

      <p><span className="bg-primary p-1">primary bg</span></p>
      <p><span className="bg-secondary p-1">secondary bg</span></p>
      <p><span className="bg-dark p-1">dark bg</span></p>
      <p><span className="bg-gray p-1">gray bg</span></p>
      <p><span className="bg-active p-1">active bg</span></p>
      <p><span className="bg-success p-1">success bg</span></p>
      <p><span className="bg-warning p-1">warning bg</span></p>
      <p><span className="bg-error p-1">error bg</span></p>
    </>
  );
};
