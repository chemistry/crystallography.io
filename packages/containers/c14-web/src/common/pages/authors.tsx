import { useRef, useMemo } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import { useAppStore } from '../store/index.js';
import { Loader } from '../components/loader/index.js';
import { Pagination } from '../components/pagination/index.js';

const formatDate = (date: Date): string => {
  const dayOfMonth = `${date.getDate() < 9 ? '0' : ''}${date.getDate()}`;
  const month = `${date.getMonth() < 9 ? '0' : ''}${date.getMonth() + 1}`;
  return `${dayOfMonth}.${month}.${date.getFullYear()}`;
};

interface AuthorsRecord {
  index: number;
  full: string;
  count: number;
  updated: string;
  id: number;
}

const AuthorsTable = ({ authors }: { authors: AuthorsRecord[] }) => {
  if (authors.length === 0) {
    return null;
  }
  return (
    <div className="table-rounded">
    <table>
      <thead>
        <tr>
          <th></th>
          <th>Name</th>
          <th>Updated</th>
          <th>Records</th>
        </tr>
      </thead>
      <tbody>
        {authors.map((item) => {
          const date = item.updated ? formatDate(new Date(item.updated)) : null;
          const { index, full, count } = item;
          return (
            <tr key={index}>
              <td>{index}</td>
              <td>
                <NavLink to={`/author/${full}`}>{full}</NavLink>
              </td>
              <td>{date}</td>
              <td>{count}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
    </div>
  );
};

const numberWithSpaces = (x: number): string => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
};

export const AuthorsPage = () => {
  const { page } = useParams();
  let currentPage = parseInt(page as string, 10);
  currentPage = currentPage && isFinite(currentPage) ? currentPage : 1;

  const isLoading = useAppStore((s) => s.authorsListPage.isLoading);
  const containerRef = useRef(null);
  const total = useAppStore((s) => s.authorsListPage.meta.total);
  const pages = useAppStore((s) => s.authorsListPage.meta.pages);
  const authorsList = useAppStore((s) => s.authorsListPage.data.authorsList);

  const authors: AuthorsRecord[] = useMemo(
    () =>
      authorsList.map(
        (res: { full: string; count: number; updated: string; id: number }, index: number) => ({
          index: index + 1,
          ...res,
        })
      ),
    [authorsList]
  );

  const split = Math.ceil(authors.length / 2);
  const authors1 = authors.slice(0, split);
  const authors2 = authors.slice(split);

  return (
    <div>
      <header className="app-layout-header">
        <h2 className="text-primary">Authors</h2>
      </header>
      <div className="app-layout-content">
        <div className="columns">
          <div className="column col-10">
            <h4 className="text-primary">{total ? `Total: ${numberWithSpaces(total)}` : null}</h4>
          </div>
        </div>
        <Loader isVisible={isLoading} scrollElement={containerRef}>
          <div className="columns">
            <div className="column col-md-12 col-5">
              <AuthorsTable authors={authors1} />
            </div>
            <div className="column col-md-12 col-5">
              <AuthorsTable authors={authors2} />
            </div>
          </div>
          <div className="columns">
            <div className="column col-10">
              <Pagination
                currentPage={currentPage}
                maxPages={10}
                totalPages={pages}
                url="/authors"
              />
            </div>
          </div>
        </Loader>
      </div>
    </div>
  );
};
