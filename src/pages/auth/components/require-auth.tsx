import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router";
import { useAppSelector } from "@/store";
import { getIsLogged } from "@/store/selectors";

export default function RequireAuth({ children }: { children: ReactNode }) {
  const isLogged = useAppSelector(getIsLogged);
  const location = useLocation();

  return isLogged ? (
    children
  ) : (
    <Navigate to="/login" state={{ from: location.pathname }} replace />
  );
}
