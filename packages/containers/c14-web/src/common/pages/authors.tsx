import { useRef } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import { useAppStore } from '../store';
import { Loader } from '../components/loader';
import { Pagination } from '../components/pagination';

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
  created: number;
}

const AuthorsTable = ({ authors }: { authors: AuthorsRecord[] }) => {
  if (authors.length === 0) {
    return null;
  }
  return (
    <table className="table table-rounded">
      <thead>
        <tr>
          <td></td>
          <td>Name</td>
          <td>Updated</td>
          <td>Records</td>
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
  const { total, pages } = useAppStore((s) => s.authorsListPage.meta);

  const authors: AuthorsRecord[] = useAppStore((s) => s.authorsListPage.data.authorsList).map(
    (res: any, index: number) => ({ index: index + 1, ...res })
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
