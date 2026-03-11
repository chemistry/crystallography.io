import { useRef, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Loader } from '../components/loader/index.js';
import { Pagination } from '../components/pagination/index.js';
import { useAppStore } from '../store/index.js';
import { StructuresList } from '../components/structure-list/structure-list.js';
import type { StructureModel } from '../models/index.js';

export const CatalogPage = () => {
  const { page } = useParams();
  let currentPage = parseInt(page as string, 10);
  currentPage = currentPage && isFinite(currentPage) ? currentPage : 1;

  const isLoading = useAppStore((s) => s.catalogPage.isLoading);
  const pages = useAppStore((s) => s.catalogPage.meta.pages);
  const containerRef = useRef(null);

  const structureIds = useAppStore((s) => s.catalogPage.data.structureIds);
  const structureById = useAppStore((s) => s.catalogPage.data.structureById);
  const structures = useMemo(
    () =>
      structureIds
        .map((id) => structureById[id])
        .filter((item) => !!item) as unknown as StructureModel[],
    [structureIds, structureById]
  );

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
