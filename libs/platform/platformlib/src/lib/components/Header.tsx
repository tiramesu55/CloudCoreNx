import { Link } from "react-router-dom";

export const Header = () => {
  return (
    <header className="Header">
      <h1>Administration</h1>
      <nav>
        <ul>
          <li>
            <Link to="/">Organizations</Link>
          </li>
          <li>
            <Link to="user">Users</Link>
          </li>
          <li>
            <Link to="user/add">Add User</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

