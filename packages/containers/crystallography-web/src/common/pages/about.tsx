import * as React from "react";
import { NavLink } from "react-router-dom";

export const AboutPage = () => {
  return (
    <div>
        <header className="app-layout-header">
            <h2 className="text-primary">About Us</h2>
        </header>
        <div className="app-layout-content">
          <div className="app-layout-page">
          <p>The aim of this project is to make access to crystal
                structure data as easy as possible.</p>
              <p>A huge amount of empirical crystallographic
                information was collected during decades and it is
                crucial for chemist, biologists, physicists, materials
                scientists as well as for engineers.
                The data is scattered in multiple databases,
                while the best ones are not free.
                Straightforward access and efficient search in
                large arrays of data is a necessary part of the scientific
                infrastructure, which is beneficial to everyone and
                stimulate the scientific and technological advances.</p>
              <p>This project aims improvements of this infrastructure
                and as a first step, a web-interface is created for search in the
                &nbsp;<a href="http://www.crystallography.net/" target="_blank">
                Crystallography Open Database (COD)</a>.</p>
              <p>We hope that the project will evolve with the help of our
                emerging community.</p>
              <p>If you are interested in cooperation or just would express
                your vision regarding the development of the project, please,
                do not hesitate to <NavLink to="/contact">contact us</NavLink>.
              </p>
          </div>
        </div>
    </div>
  );
};
