import { Navigate, Outlet, Route, Routes } from "react-router";
import Layout from "@layout/layout";
import LoginPage from "@auth/login-page";
import RequireAuth from "@auth/components/require-auth";
import AdvertsPage from "@adverts/adverts-page";
import AdvertPage from "@adverts/advert-page";
import NewAdvertPage from "@adverts/new-advert-page";

export default function App() {
  return (
    <Routes>
      <Route index element={<Navigate to="/adverts" />}></Route>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/adverts"
        element={
          <RequireAuth>
            <Layout>
              <Outlet />
            </Layout>
          </RequireAuth>
        }
      >
        <Route index element={<AdvertsPage />}></Route>
        <Route path=":advertId" element={<AdvertPage />}></Route>
        <Route path="new" element={<NewAdvertPage />}></Route>
      </Route>
      <Route path="/404" element={<h1>404</h1>} />
      <Route path="*" element={<Navigate to="/404" />} />
    </Routes>
  );
}
