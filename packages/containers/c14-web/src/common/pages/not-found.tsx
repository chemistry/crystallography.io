import { NavLink } from 'react-router-dom';

export const NotFoundPage = () => {
  return (
    <div>
      <header className="app-layout-header">
        <h2 className="text-primary">Page Not Found</h2>
      </header>
      <div className="app-layout-content">
        <div className="app-layout-page" style={{ maxWidth: '600px' }}>
          <h4 className="text-primary">404</h4>
          <p>The page you are looking for does not exist or has been moved.</p>
          <NavLink to="/" className="btn">
            Back to Search
          </NavLink>
        </div>
      </div>
    </div>
  );
};
