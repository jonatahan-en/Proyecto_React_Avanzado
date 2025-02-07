import { ReactNode } from "react";
import { Link, NavLink } from "react-router";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div>
      <header>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <NavLink to="/adverts" end className="group">
                <span className="group-[.active]:underline">Adverts List</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/adverts/new" className="group">
                <span className="group-[.active]:underline">New Advert</span>
              </NavLink>
            </li>
            <li>
              <Link to="/login">Login</Link>
            </li>
          </ul>
        </nav>
      </header>
      <main>{children}</main>
      <footer>@2025 Keepcoding</footer>
    </div>
  );
}
