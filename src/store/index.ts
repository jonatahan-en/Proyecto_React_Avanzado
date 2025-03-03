// Creamos el store en el archivo src/store/index.ts
import {createStore} from  "redux";
import {reducer} from "./reducers";

export const store = createStore(reducer);
// export type AppStore = typeof store;
// export type AppGetState = AppStore["getState"];
// export type RootState = ReturnType<AppGetState>;
// export type AppDispatch = AppStore["dispatch"];

store.dispatch({type: "auth/login"});
