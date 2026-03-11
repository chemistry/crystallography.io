import { SearchTab } from '../components/index.js';

export const SearchPage = () => {
  return (
    <div className="search-layout-tabs">
      <header className="app-layout-header">
        <h2 className="text-primary">Crystal Structure Search</h2>
        <SearchTab />
      </header>
      <div className="app-layout-content"></div>
    </div>
  );
};
