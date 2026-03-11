import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { SearchTab } from '../../components/index.js';
import { useAppStore } from '../../store/index.js';
import { useInBrowser } from '../../services/index.js';

let MolPad: React.ForwardRefExoticComponent<
  React.RefAttributes<{
    isSutableForSearch: () => string;
    getJmol: () => unknown;
  }>
> | null = null;

export const SearchByStructurePage = () => {
  const molpadRef = useRef(null);
  const navigate = useNavigate();
  const searchStructureByStructure = useAppStore((s) => s.searchStructureByStructure);

  useInBrowser(() => {
    (async () => {
      const mod = await import('@chemistry/molpad');
      MolPad = mod.MolPad;
    })();
  }, []);

  const handleSubmit = async () => {
    if (MolPad && molpadRef && molpadRef.current) {
      const molpad = molpadRef.current as {
        isSutableForSearch: () => string;
        getJmol: () => unknown;
      };
      const validationMessage = molpad.isSutableForSearch();
      if (validationMessage !== '') {
        return;
      }
      const jmol = molpad.getJmol();
      const searchId = await searchStructureByStructure({ molecule: jmol });
      if (searchId) {
        navigate(`/results/${searchId}/1`);
      }
    }
  };

  return (
    <div className="search-layout-tabs">
      <header className="app-layout-header">
        <h2 className="text-primary">Crystal Structure Search</h2>
        <SearchTab />
      </header>
      <div className="app-layout-content">
        <div className="search-layout__page">
          <div className="search-layout__molpad-editor">
            {MolPad ? <MolPad ref={molpadRef} /> : null}
          </div>
          <div className="search-layout__search_row">
            <div className="column col-6">
              <p className="text-gray">
                Search will be performed considering all bonds order as "any"
              </p>
            </div>
          </div>
          <div>
            <div className="column col-6">
              <button
                className="btn btn-primary input-inline search-layout__search_btn"
                onClick={handleSubmit}
              >
                Search
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
