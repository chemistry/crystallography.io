import { NavLink } from 'react-router-dom';

export const SearchTab = () => {
  return (
    <ul className="tab tab-block">
      <li className="tab-item">
        <NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : '')}>
          Structure
        </NavLink>
      </li>
      <li className="tab-item">
        <NavLink to="/search/author" className={({ isActive }) => (isActive ? 'active' : '')}>
          Author
        </NavLink>
      </li>
      <li className="tab-item">
        <NavLink to="/search/name" className={({ isActive }) => (isActive ? 'active' : '')}>
          Name
        </NavLink>
      </li>
      <li className="tab-item">
        <NavLink to="/search/formula" end className={({ isActive }) => (isActive ? 'active' : '')}>
          Formula
        </NavLink>
      </li>
      <li className="tab-item">
        <NavLink to="/search/unitcell" end className={({ isActive }) => (isActive ? 'active' : '')}>
          Unit Cell
        </NavLink>
      </li>
    </ul>
  );
};
