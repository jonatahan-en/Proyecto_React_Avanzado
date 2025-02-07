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
              <NavLink
                to="/adverts"
                end
                className="aria-[current=page]:underline"
              >
                Adverts List
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/adverts/new"
                className="aria-[current=page]:underline"
              >
                New Advert
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
