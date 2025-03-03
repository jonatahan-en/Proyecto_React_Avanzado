import type { Advert } from "../pages/adverts/types";
import type { Actions } from "./actions";


export type State = {
    auth: boolean;
    adverts: Advert[];
}

const defaultState: State = {
    auth: false,
    adverts: [],
} 

export function auth(state = defaultState.auth,action: Actions):State["auth"] {
    switch (action.type) {
        case "auth/login":
            return  true;
        case "auth/logout":
            return  false;
        default:
            return state;
    }
}

export function adverts(state = defaultState.adverts,action: Actions):State["adverts"] {
    switch (action.type) {
        case "adverts/loaded":
            return action.payload;
        case "adverts/created":
            return [...state, action.payload];
        default:
            return state;
    }
}

