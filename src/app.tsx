import { Navigate, Outlet, Route, Routes } from "react-router";
import Layout from "@/components/layout/layout";

export default function App() {
  return (
    <Routes>
      <Route index element={<Navigate to="/adverts" />}></Route>
      <Route path="/login" element={<h1>Login</h1>} />
      <Route
        path="/adverts"
        element={
          <Layout>
            <Outlet />
          </Layout>
        }
      >
        <Route index element={<h1>AdvertsPage</h1>}></Route>
        <Route path=":advertId" element={<h1>AdvertPage</h1>}></Route>
        <Route path="new" element={<h1>NewAdvertPage</h1>}></Route>
      </Route>
      <Route path="/404" element={<h1>404</h1>} />
      <Route path="*" element={<Navigate to="/404" />} />
    </Routes>
  );
}
