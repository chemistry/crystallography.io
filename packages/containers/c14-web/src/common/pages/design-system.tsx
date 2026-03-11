import {
  LogoIcon,
  CollapseIcon,
  NavBtnIcon,
  LogoMobileIcon,
  MenuAddStructureIcon,
  MenuAuthorsIcon,
  MenuInfoIcon,
  MenuNewsIcon,
  MenuSearchIcon,
  MenuShutdownIcon,
  MenuProfileIcon,
  SearchHistoryIcon,
  SignInIcon,
  CloseIcon,
  MenuCatalogIcon,
} from '../icons/index.js';

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div style={{ marginBottom: '2rem' }}>
    <h3
      className="text-primary"
      style={{ borderBottom: '2px solid var(--color-light-grey)', paddingBottom: '0.5rem' }}
    >
      {title}
    </h3>
    {children}
  </div>
);

const ColorSwatch = ({ name, variable }: { name: string; variable: string }) => (
  <div
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.5rem',
      minWidth: '220px',
      marginBottom: '0.5rem',
    }}
  >
    <div
      style={{
        width: '32px',
        height: '32px',
        borderRadius: '6px',
        background: `var(${variable})`,
        border: '1px solid var(--color-light-grey)',
        flexShrink: 0,
      }}
    />
    <div>
      <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{name}</div>
      <code style={{ fontSize: '0.75rem', color: 'var(--color-dark-grey)' }}>{variable}</code>
    </div>
  </div>
);

const SpacingBar = ({ name, variable }: { name: string; variable: string }) => (
  <div style={{ marginBottom: '0.5rem' }}>
    <div style={{ fontSize: '0.85rem', marginBottom: '0.25rem' }}>
      <strong>{name}</strong> <code style={{ color: 'var(--color-dark-grey)' }}>{variable}</code>
    </div>
    <div
      style={{
        height: '12px',
        width: `var(${variable})`,
        maxWidth: '100%',
        background: 'var(--color-additional)',
        borderRadius: '4px',
      }}
    />
  </div>
);

const IconCell = ({ name, children }: { name: string; children: React.ReactNode }) => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '1rem',
      minWidth: '120px',
      background: 'var(--color-clear-grey)',
      borderRadius: '8px',
    }}
  >
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '48px',
        height: '48px',
        background: 'var(--color-primary)',
        borderRadius: '8px',
      }}
    >
      {children}
    </div>
    <code
      style={{
        fontSize: '0.7rem',
        color: 'var(--color-dark-grey)',
        textAlign: 'center',
        wordBreak: 'break-word',
      }}
    >
      {name}
    </code>
  </div>
);

export const DesignSystemPage = () => {
  return (
    <div>
      <header className="app-layout-header">
        <h2 className="text-primary">Design System</h2>
      </header>
      <div className="app-layout-content">
        <div className="app-layout-page" style={{ maxWidth: '1100px' }}>
          {/* Colors */}
          <Section title="Colors">
            <h4 style={{ marginTop: '1rem' }}>Brand</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem 1rem' }}>
              <ColorSwatch name="Primary" variable="--color-primary" />
              <ColorSwatch name="Primary Opacity" variable="--color-primary-opacity" />
              <ColorSwatch name="Secondary" variable="--color-secondary" />
              <ColorSwatch name="Additional" variable="--color-additional" />
              <ColorSwatch name="Active" variable="--color-active" />
              <ColorSwatch name="Link" variable="--color-link" />
            </div>
            <h4 style={{ marginTop: '1rem' }}>Feedback</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem 1rem' }}>
              <ColorSwatch name="Success" variable="--color-success" />
              <ColorSwatch name="Warning" variable="--color-warning" />
              <ColorSwatch name="Error" variable="--color-error" />
            </div>
            <h4 style={{ marginTop: '1rem' }}>Neutrals</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem 1rem' }}>
              <ColorSwatch name="Black" variable="--color-black" />
              <ColorSwatch name="Dark Grey" variable="--color-dark-grey" />
              <ColorSwatch name="Grey" variable="--color-grey" />
              <ColorSwatch name="Light Grey" variable="--color-light-grey" />
              <ColorSwatch name="Clear Grey" variable="--color-clear-grey" />
              <ColorSwatch name="Background" variable="--color-bg" />
              <ColorSwatch name="White" variable="--color-white" />
            </div>
          </Section>

          {/* Spacing */}
          <Section title="Spacing">
            <SpacingBar name="Sidebar Open" variable="--spacing-sidebar-open" />
            <SpacingBar name="Sidebar Closed" variable="--spacing-sidebar-closed" />
            <SpacingBar name="Header Height" variable="--spacing-header-height" />
            <SpacingBar name="Mobile Nav Height" variable="--spacing-mobile-nav-height" />
          </Section>

          {/* Typography */}
          <Section title="Typography">
            <div style={{ marginBottom: '1rem' }}>
              <code style={{ color: 'var(--color-dark-grey)', fontSize: '0.75rem' }}>
                font-family: var(--font-family-base)
              </code>
            </div>
            <h1>Heading 1 &mdash; 2.5rem</h1>
            <h2>Heading 2 &mdash; 2rem</h2>
            <h3>Heading 3 &mdash; 2rem</h3>
            <h4>Heading 4 &mdash; 1.125rem</h4>
            <h5>Heading 5 &mdash; 1.5rem</h5>
            <h6>Heading 6 &mdash; 1.25rem</h6>
            <p>
              Body text &mdash; 16px base size with 1.4 line-height. The quick brown fox jumps over
              the lazy dog.
            </p>
            <p className="text-primary">Text Primary</p>
            <p className="text-active">Text Active</p>
            <p className="text-gray">Text Gray</p>
            <p className="text-success">Text Success</p>
            <p className="text-warning">Text Warning</p>
            <p className="text-error">Text Error</p>
            <p>
              <span className="text-bold">Bold text</span> and <a href="#">link text</a>
            </p>
          </Section>

          {/* Icons */}
          <Section title="Icons">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
              <IconCell name="LogoIcon">
                <LogoIcon />
              </IconCell>
              <IconCell name="LogoMobileIcon">
                <LogoMobileIcon />
              </IconCell>
              <IconCell name="MenuSearchIcon">
                <MenuSearchIcon />
              </IconCell>
              <IconCell name="MenuAuthorsIcon">
                <MenuAuthorsIcon />
              </IconCell>
              <IconCell name="MenuCatalogIcon">
                <MenuCatalogIcon />
              </IconCell>
              <IconCell name="MenuNewsIcon">
                <MenuNewsIcon />
              </IconCell>
              <IconCell name="MenuInfoIcon">
                <MenuInfoIcon />
              </IconCell>
              <IconCell name="MenuProfileIcon">
                <MenuProfileIcon />
              </IconCell>
              <IconCell name="MenuAddStructureIcon">
                <MenuAddStructureIcon />
              </IconCell>
              <IconCell name="MenuShutdownIcon">
                <MenuShutdownIcon />
              </IconCell>
              <IconCell name="SearchHistoryIcon">
                <SearchHistoryIcon />
              </IconCell>
              <IconCell name="SignInIcon">
                <SignInIcon />
              </IconCell>
              <IconCell name="CollapseIcon">
                <CollapseIcon />
              </IconCell>
              <IconCell name="NavBtnIcon">
                <NavBtnIcon />
              </IconCell>
              <IconCell name="CloseIcon">
                <CloseIcon />
              </IconCell>
            </div>
          </Section>

          {/* Buttons */}
          <Section title="Buttons">
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0.75rem',
                alignItems: 'center',
                marginBottom: '1rem',
              }}
            >
              <button className="btn">Default</button>
              <button className="btn btn-primary">Primary</button>
              <button className="btn btn-link">Link</button>
              <button className="btn btn-active">Active</button>
              <button className="btn" disabled>
                Disabled
              </button>
            </div>
            <div
              style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}
            >
              <button className="btn btn-icon">+</button>
              <a href="#" className="btn btn-active">
                Link as Button
              </a>
            </div>
          </Section>

          {/* Forms */}
          <Section title="Forms">
            <div style={{ maxWidth: '500px' }}>
              <div className="form-group">
                <label className="form-label">Text Input</label>
                <input className="form-input" type="text" placeholder="Enter value..." />
              </div>
              <div className="form-group">
                <label className="form-label">Input with Icon &amp; Button</label>
                <div className="has-icon-left has-button-right">
                  <svg
                    className="form-icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M15.5 14h-.79l-.28-.27A6.47 6.47 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"
                      fill="var(--color-grey)"
                    />
                  </svg>
                  <input className="form-input" type="text" placeholder="Search..." />
                  <button className="form-button btn">Go</button>
                </div>
              </div>
            </div>
          </Section>

          {/* Tabs */}
          <Section title="Tabs">
            <ul className="tab">
              <li className="tab-item active">
                <a href="#">Active Tab</a>
              </li>
              <li className="tab-item">
                <a href="#">Tab Two</a>
              </li>
              <li className="tab-item">
                <a href="#">Tab Three</a>
              </li>
              <li className="tab-item">
                <a href="#">Tab Four</a>
              </li>
            </ul>
          </Section>

          {/* Tables */}
          <Section title="Tables">
            <h4>Default Table</h4>
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Formula</th>
                  <th>Space Group</th>
                  <th>a (&Aring;)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Quartz</td>
                  <td>
                    SiO<sub>2</sub>
                  </td>
                  <td>P 32 2 1</td>
                  <td>4.916</td>
                </tr>
                <tr>
                  <td>Halite</td>
                  <td>NaCl</td>
                  <td>F m -3 m</td>
                  <td>5.64</td>
                </tr>
                <tr>
                  <td>Diamond</td>
                  <td>C</td>
                  <td>F d -3 m</td>
                  <td>3.567</td>
                </tr>
              </tbody>
            </table>
            <h4 style={{ marginTop: '1.5rem' }}>Rounded Table</h4>
            <div className="table-rounded">
              <table>
                <thead>
                  <tr>
                    <th>Property</th>
                    <th>Value</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Temperature</td>
                    <td>298 K</td>
                  </tr>
                  <tr>
                    <td>Volume</td>
                    <td>
                      113.01 &Aring;<sup>3</sup>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      R<sub>int</sub>
                    </td>
                    <td>0.035</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Section>

          {/* Grid */}
          <Section title="Grid (Columns)">
            <div className="columns" style={{ marginBottom: '0.5rem' }}>
              <div
                className="column col-6"
                style={{
                  background: 'var(--color-clear-grey)',
                  padding: '0.5rem',
                  borderRadius: '4px',
                }}
              >
                col-6
              </div>
              <div
                className="column col-6"
                style={{
                  background: 'var(--color-light-grey)',
                  padding: '0.5rem',
                  borderRadius: '4px',
                }}
              >
                col-6
              </div>
            </div>
            <div className="columns" style={{ marginBottom: '0.5rem' }}>
              <div
                className="column col-5"
                style={{
                  background: 'var(--color-clear-grey)',
                  padding: '0.5rem',
                  borderRadius: '4px',
                }}
              >
                col-5
              </div>
              <div
                className="column col-7"
                style={{
                  background: 'var(--color-light-grey)',
                  padding: '0.5rem',
                  borderRadius: '4px',
                }}
              >
                col-7
              </div>
            </div>
            <div className="columns">
              <div
                className="column col-12"
                style={{
                  background: 'var(--color-clear-grey)',
                  padding: '0.5rem',
                  borderRadius: '4px',
                }}
              >
                col-12
              </div>
            </div>
          </Section>

          {/* Pagination */}
          <Section title="Pagination">
            <div className="c-pagination">
              <ul className="c-pagination-list">
                <li className="c-page-item">
                  <span className="c-page-link">&laquo;</span>
                </li>
                <li className="c-page-item active">
                  <span className="c-page-link">1</span>
                </li>
                <li className="c-page-item">
                  <span className="c-page-link">2</span>
                </li>
                <li className="c-page-item">
                  <span className="c-page-link">3</span>
                </li>
                <li className="c-page-item">
                  <span className="c-page-link">4</span>
                </li>
                <li className="c-page-item">
                  <span className="c-page-link">5</span>
                </li>
                <li className="c-page-item">
                  <span className="c-page-link">&raquo;</span>
                </li>
              </ul>
            </div>
          </Section>

          {/* Timeline */}
          <Section title="Timeline">
            <div className="timeline">
              <div className="timeline-item">
                <div className="timeline-left">
                  <div className="timeline-icon"></div>
                </div>
                <div className="timeline-content">
                  <strong>Phase 1 — Infrastructure</strong>
                  <div className="timeline-subtitle">January 2024</div>
                  <div className="timeline-text">
                    Set up Docker Swarm, Traefik, and CI/CD pipeline.
                  </div>
                </div>
              </div>
              <div className="timeline-item">
                <div className="timeline-left">
                  <div className="timeline-icon"></div>
                </div>
                <div className="timeline-content">
                  <strong>Phase 2 — Backend</strong>
                  <div className="timeline-subtitle">March 2024</div>
                  <div className="timeline-text">
                    <ul>
                      <li>REST API with Express + MongoDB</li>
                      <li>Search workers with RabbitMQ</li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="timeline-item">
                <div className="timeline-left">
                  <div className="timeline-icon"></div>
                </div>
                <div className="timeline-content">
                  <strong>Phase 3 — Frontend</strong>
                  <div className="timeline-subtitle">June 2024</div>
                  <div className="timeline-text">React + Vite SPA with SSR support.</div>
                </div>
              </div>
            </div>
          </Section>

          {/* Download App Banner */}
          <Section title="Download App Banner">
            <div className="c-download-application">
              <span className="c-download-application-close">&times;</span>
              <div className="c-download-application-icon">
                <LogoIcon />
              </div>
              <div className="c-download-application-message">
                Download the desktop app for offline crystal structure search
              </div>
            </div>
          </Section>

          {/* Alerts */}
          <Section title="Alerts">
            <div
              className="alert alert-danger"
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
            >
              <span>This is a danger/error alert message.</span>
              <span style={{ cursor: 'pointer', fontSize: '1.25rem', lineHeight: 1, opacity: 0.7 }}>
                &times;
              </span>
            </div>
          </Section>

          {/* Progress Bar */}
          <Section title="Progress Bar">
            <div className="bar bar-sm">
              <div className="bar-item" style={{ width: '65%' }}></div>
            </div>
          </Section>

          {/* Cards / Page Containers */}
          <Section title="Page Containers">
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: '280px' }}>
                <h4>app-layout-page</h4>
                <div className="app-layout-page" style={{ minHeight: 'auto', padding: '1rem' }}>
                  White card with border and rounded corners.
                </div>
              </div>
              <div style={{ flex: 1, minWidth: '280px' }}>
                <h4>app-layout-page-transparent</h4>
                <div
                  className="app-layout-page-transparent"
                  style={{ minHeight: 'auto', padding: '1rem', background: 'var(--color-bg)' }}
                >
                  Transparent container (no border).
                </div>
              </div>
            </div>
          </Section>
        </div>
      </div>
    </div>
  );
};
