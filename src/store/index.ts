// Creamos el store en el archivo src/store/index.ts
import {createStore} from  "redux";
import {reducer} from "./reducers";

export default function configureStore() {
    const store = createStore(reducer);
    return store;
}

// export type AppStore = typeof store;
// export type AppGetState = AppStore["getState"];
// export type RootState = ReturnType<AppGetState>;
// export type AppDispatch = AppStore["dispatch"];


