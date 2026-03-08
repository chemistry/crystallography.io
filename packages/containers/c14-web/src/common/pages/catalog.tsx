import { useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Loader } from '../components/loader';
import { Pagination } from '../components/pagination';
import { useAppStore } from '../store';
import { StructuresList } from '../components/structure-list/structure-list';

export const CatalogPage = () => {
  const { page } = useParams();
  let currentPage = parseInt(page!, 10);
  currentPage = currentPage && isFinite(currentPage) ? currentPage : 1;

  const isLoading = useAppStore((s) => s.catalogPage.isLoading);
  const pages = useAppStore((s) => s.catalogPage.meta.pages);
  const containerRef = useRef(null);

  const structures = useAppStore((s) => {
    const ids = s.catalogPage.data.structureIds;
    const byId: any = s.catalogPage.data.structureById;
    return ids.map((id) => byId[id]).filter((item) => !!item);
  });

  return (
    <div>
      <header className="app-layout-header">
        <h2 className="text-primary">Catalog</h2>
      </header>
      <div className="app-layout-content" ref={containerRef}>
        <div className="app-layout-page-transparent">
          <Loader isVisible={isLoading} scrollElement={containerRef}>
            <Pagination currentPage={currentPage} maxPages={10} totalPages={pages} url="/catalog" />
            <StructuresList list={structures} />
          </Loader>
        </div>
      </div>
    </div>
  );
};
