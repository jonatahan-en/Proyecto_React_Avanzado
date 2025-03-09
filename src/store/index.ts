// Creamos el store en el archivo src/store/index.ts
import { applyMiddleware, combineReducers, createStore } from "redux";
import * as reducers from "./reducers";
import { useDispatch, useSelector } from "react-redux";
import type { State } from "./reducers";
import { composeWithDevTools } from "redux-devtools-extension";
import * as thunk from "redux-thunk";
import type { Actions } from "./actions";

import * as auth from "../pages/auth/service";
import * as adverts from "../pages/adverts/service";
import type { createBrowserRouter } from "react-router";

//creamos los tipos nesesarios para poder utilizar el router
type Router = ReturnType<typeof createBrowserRouter>;
// estos tipos son nesesarios para poder utilizar el extraargument en el thunk
type Api = {
    auth: typeof auth;
    adverts: typeof adverts;
};
type ExtraArgument = {
    api: Api;
    router: Router;
};

//
const failurMiddleware = (router: Router) => (store) => (next) => (action) => {
    const result = next(action);
    if (!action.type.endsWith("/rejected")) {
        return result;
    }
    if (action.payload.code === "NOT_FOUND") {
        return router.navigate("/404");
    }
    if (action.payload.code === "UNAUTHORIZED") {
        return router.navigate("/login");
    }
    return result;
};

// exportamos el store y los tipos nesesarios para utilizarlo
export default function configureStore(
    preloadedState: Partial<State>,
    router: Router,
) {
    const RootReducer = combineReducers(reducers);
    const store = createStore(
        RootReducer,
        preloadedState as never,
        composeWithDevTools(
            applyMiddleware(
                thunk.withExtraArgument<State, Actions, ExtraArgument>({
                    api: { auth, adverts },
                    router,
                }),
                failurMiddleware(router),
            ),
        ),
    );

    return store;
}

export type AppStore = ReturnType<typeof configureStore>;
export type AppGetState = AppStore["getState"];
export type RootState = ReturnType<AppGetState>;
export type AppDispatch = AppStore["dispatch"];

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();

export type AppThunk<ReturnType = void> = thunk.ThunkAction<
    ReturnType,
    RootState,
    ExtraArgument,
    Actions
>;
