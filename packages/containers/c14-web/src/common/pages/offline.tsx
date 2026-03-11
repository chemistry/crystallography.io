export const OfflinePage = () => {
  return (
    <div>
      <header className="app-layout-header">
        <h2 className="text-primary">Offline</h2>
      </header>
      <div className="app-layout-content">
        <div className="app-layout-page" style={{ maxWidth: '600px' }}>
          <h4 className="text-primary">You are offline</h4>
          <p>Please check your internet connection and try again.</p>
        </div>
      </div>
    </div>
  );
};
