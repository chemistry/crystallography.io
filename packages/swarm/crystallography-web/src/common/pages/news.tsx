import * as React from "react";

export const NewsPage = () => {
  return (
      <div>
          <header className="app-layout-header">
              <h2 className="text-primary">Updates</h2>
          </header>
          <div className="app-layout-content">
            <div className="app-layout-page">
                  <div className="timeline">

                  <div className="timeline-item" id="timeline-example-7">
                        <div className="timeline-left">
                            <a className="timeline-icon" href="#timeline-example-7"></a>
                        </div>
                        <div className="timeline-content">
                            <div className="timeline-subtitle">
                                09.01.2021
                            </div>
                            <div className="timeline-text">
                                Migration to new domain https://crystallography.io, connection secured
                            </div>
                        </div>
                    </div>
                    <div className="timeline-item" id="timeline-example-7">
                        <div className="timeline-left">
                            <a className="timeline-icon" href="#timeline-example-7"></a>
                        </div>
                        <div className="timeline-content">
                            <div className="timeline-subtitle">
                                24.12.2020
                            </div>
                            <div className="timeline-text">
                                Version 4.0 was released
                                <ul>
                                    <li>Application Redesign</li>
                                    <li>Performance Improvements</li>
                                    <li>Open Source Code</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="timeline-item" id="timeline-example-7">
                      <div className="timeline-left">
                        <a className="timeline-icon" href="#timeline-example-7"></a>
                      </div>
                      <div className="timeline-content">
                          <div className="timeline-subtitle">
                              30.04.2018
                          </div>
                          <div className="timeline-text">
                              Substructure Search
                          </div>
                      </div>
                    </div>

                    <div className="timeline-item" id="timeline-example-6">
                      <div className="timeline-left">
                        <a className="timeline-icon" href="#timeline-example-6"></a>
                      </div>
                      <div className="timeline-content">
                          <div className="timeline-subtitle">
                              15.05.2017
                          </div>
                          <div className="timeline-text">
                              Search by name improvements and bug fixes
                          </div>
                      </div>
                    </div>

                    <div className="timeline-item" id="timeline-example-5">
                      <div className="timeline-left">
                        <a className="timeline-icon" href="#timeline-example-5"></a>
                      </div>
                      <div className="timeline-content">
                          <div className="timeline-subtitle">
                              05.04.2017
                          </div>
                          <div className="timeline-text">
                              Crystal Structure Viewer added
                          </div>
                      </div>
                    </div>

                    <div className="timeline-item" id="timeline-example-4">
                      <div className="timeline-left">
                        <a className="timeline-icon" href="#timeline-example-4"></a>
                      </div>
                      <div className="timeline-content">
                          <div className="timeline-subtitle">
                              31.01.2017
                          </div>
                          <div className="timeline-text">
                            Website version 2.1 was released
                            <ul>
                                <li>Name & Author autocomplete</li>
                                <li>List of Authors & Author structures page</li>
                                <li>Formula search improvements</li>
                            </ul>
                          </div>
                      </div>
                    </div>

                    <div className="timeline-item" id="timeline-example-3">
                      <div className="timeline-left">
                        <a className="timeline-icon" href="#timeline-example-3"></a>
                      </div>
                      <div className="timeline-content">
                          <div className="timeline-subtitle">
                              27.12.2016
                          </div>
                          <div className="timeline-text">
                            Website was upgraded to version 2.0
                            <ul>
                                <li>Website was redesigned</li>
                                <li>Core was transferred to ReactJS</li>
                                <li>App was desined as Isomorphic application</li>
                                <li>Synchronization with COD was improved</li>
                            </ul>
                          </div>
                      </div>
                    </div>

                    <div className="timeline-item" id="timeline-example-2">
                      <div className="timeline-left">
                        <a className="timeline-icon" href="#timeline-example-2"></a>
                      </div>
                      <div className="timeline-content">
                          <div className="timeline-subtitle">
                              24.04.2015
                          </div>
                          <div className="timeline-text">
                            Basic optimization of the project was performed (search by formula, author or unit cell).
                          </div>
                      </div>
                    </div>

                    <div className="timeline-item" id="timeline-example-1">
                      <div className="timeline-left">
                        <a className="timeline-icon" href="#timeline-example-1"></a>
                      </div>
                      <div className="timeline-content">
                          <div className="timeline-subtitle">
                              28.02.2015
                          </div>
                          <div className="timeline-text">
                            A COD database mirror was installed (crystal structure catalog).
                          </div>
                      </div>
                    </div>

                  </div>
              </div>
          </div>
      </div>
  );
};
