import { Link, NavLink } from "react-router";
import type { ReactNode } from "react";
import AuthButton from "@/pages/auth/components/auth-button";

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
              <AuthButton />
            </li>
          </ul>
        </nav>
      </header>
      <main>{children}</main>
      <footer>@2025 Keepcoding</footer>
    </div>
  );
}
