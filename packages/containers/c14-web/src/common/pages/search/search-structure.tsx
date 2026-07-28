import { useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import type { MolPadHandle } from '@chemistry/molpad';
import { SearchTab } from '../../components/index.js';
import { useAppStore } from '../../store/index.js';
import { useInBrowser } from '../../services/index.js';

type MolPadComponent = React.ForwardRefExoticComponent<React.RefAttributes<MolPadHandle>>;

export const SearchByStructurePage = () => {
  const molpadRef = useRef<MolPadHandle>(null);
  const navigate = useNavigate();
  const searchStructureByStructure = useAppStore((s) => s.searchStructureByStructure);
  const [MolPad, setMolPad] = useState<MolPadComponent | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  useInBrowser(() => {
    (async () => {
      const [mod] = await Promise.all([
        import('@chemistry/molpad'),
        import('@chemistry/molpad/molpad.css'),
      ]);
      setMolPad(() => mod.MolPad);
    })();
  }, []);

  const handleSubmit = async () => {
    if (MolPad && molpadRef && molpadRef.current) {
      const jmol = molpadRef.current.getJmol();
      if (!jmol || jmol.atoms.length <= 2) {
        setError('Molecule should contain more than 2 atoms');
        return;
      }
      setError(null);
      setIsSearching(true);
      const searchId = await searchStructureByStructure({ molecule: jmol });
      setIsSearching(false);
      if (searchId) {
        navigate(`/results/${searchId}/1`);
      } else {
        setError('Search request failed. Please try again.');
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
                className="btn btn-active search-layout__search_btn"
                onClick={handleSubmit}
                disabled={isSearching}
              >
                {isSearching ? 'Searching...' : 'Search'}
              </button>
            </div>
          </div>
          {error ? (
            <div className="search-layout__search_row">
              <div className="column col-6">
                <p className="text-error">{error}</p>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
