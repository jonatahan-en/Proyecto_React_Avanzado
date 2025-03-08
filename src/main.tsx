import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";
import "./index.css";
import storage from "./utils/storage";
import { setAuthorizationHeader } from "./api/client";
import App from "./app";
import { ErrorBoundary } from "./pages/error/error-boundary";
import { Provider } from "react-redux";
import configureStore from "./store";

const accessToken = storage.get("auth");
if (accessToken) {
  setAuthorizationHeader(accessToken);
}
const router = createBrowserRouter([{ path: "*", element: <App /> }]);
const store = configureStore({ auth: !!accessToken }, router);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      {/* <BrowserRouter> */}
      <ErrorBoundary>
        <RouterProvider router={router} />
      </ErrorBoundary>
      {/* </BrowserRouter> */}
    </Provider>
  </StrictMode>,
);
