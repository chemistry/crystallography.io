import { useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useAppStore, useAppStoreApi } from '../store';
import { Loader, Pagination } from '../components';
import { StructuresList } from '../components/structure-list/structure-list';
import { useBrowserEffect } from '../hooks';
import { subscribeToWSUpdates, closeWSSubscription } from '../store/ws-manager';

const parsePage = (page?: string): number => {
  let currentPage = parseInt(page as string, 10);
  currentPage = currentPage && isFinite(currentPage) ? currentPage : 1;
  return currentPage;
};

const numberWithSpaces = (x: number): string => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
};

const MAX_PAGES = 10;

export const SearchResultsPage = () => {
  const store = useAppStoreApi();
  const { id, page } = useParams();
  const isLoading = useAppStore((s) => s.searchResults.isLoading);
  const pages = useAppStore((s) => s.searchResults.meta.pagesAvailable);
  const progress = useAppStore((s) => s.searchResults.meta.progress);
  const found = useAppStore((s) => s.searchResults.meta.found);
  const currentPage = parsePage(page);
  const containerRef = useRef(null);

  const structures = useAppStore((s) => {
    const ids = s.searchResults.data.structureIds;
    const byId: any = s.searchResults.data.structureById;
    return ids.map((structureId) => byId[structureId]).filter((item) => !!item);
  });

  useBrowserEffect(() => {
    subscribeToWSUpdates(store);
    return () => {
      closeWSSubscription(store);
    };
  }, [id, page]);

  return (
    <div>
      <header className="app-layout-header">
        <h2 className="text-primary">Results</h2>
      </header>
      <div className="app-layout-content" ref={containerRef}>
        <div className="app-layout-page-transparent">
          <Loader isVisible={isLoading} scrollElement={containerRef}>
            <div className="bar bar-sm">
              <div className="bar-item" role="progressbar" style={{ width: `${progress}%` }}>
                {`${progress}%`}
              </div>
            </div>
            <div className="columns">
              <div className="column col-10">
                <h4 className="text-primary">{`Total Results: ${numberWithSpaces(found)}`}</h4>
              </div>
            </div>
            <Pagination currentPage={currentPage} maxPages={MAX_PAGES} totalPages={pages} url={`/results/${id}`} />
            <StructuresList list={structures} />
          </Loader>
        </div>
      </div>
    </div>
  );
};
