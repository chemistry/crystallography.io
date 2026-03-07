import { useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Pagination } from '../components';
import { Loader } from '../components/loader';
import { StructuresList } from '../components/structure-list/structure-list';
import { useAppStore } from '../store';

const numberWithSpaces = (x: number): string => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
};

const MAX_PAGES = 10;

export const AuthorDetailsPage = () => {
  const { page, name } = useParams();
  let currentPage = parseInt(page as string, 10);
  currentPage = currentPage && isFinite(currentPage) ? currentPage : 1;

  const found = useAppStore((s) => s.authorsDetailsPage.meta.total);
  const isLoading = useAppStore((s) => s.authorsDetailsPage.isLoading);
  const pages = useAppStore((s) => s.authorsDetailsPage.meta.pages);
  const structures = useAppStore((s) => {
    const ids = s.authorsDetailsPage.data.structureIds;
    const byId: any = s.authorsDetailsPage.data.structureById;
    return ids.map((id) => byId[id]).filter((item) => !!item);
  });

  const containerRef = useRef(null);

  return (
    <div>
      <header className="app-layout-header">
        <h2 className="text-primary">Structures by: {name}</h2>
      </header>
      <div className="app-layout-content" ref={containerRef}>
        <div className="app-layout-page-transparent">
          <div className="columns">
            <div className="column col-10">
              <h4 className="text-primary">{`Total: ${numberWithSpaces(found)}`}</h4>
            </div>
          </div>
          <Loader isVisible={isLoading} scrollElement={containerRef}>
            <Pagination currentPage={currentPage} maxPages={MAX_PAGES} totalPages={pages} url={`/author/${name}`} />
            <StructuresList list={structures} />
          </Loader>
        </div>
      </div>
    </div>
  );
};
