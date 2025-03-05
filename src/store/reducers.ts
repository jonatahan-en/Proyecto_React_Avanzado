import type { Advert } from "../pages/adverts/types";
import type { Actions } from "./actions";


export type State = {
    auth: boolean;
    adverts: { data: Advert[] | null, loaded: boolean };
    ui: {
        pending: boolean;
        error: Error | null;
    };
}

const defaultState: State = {
    auth: false,
    adverts:{ data: null, loaded: false },
    ui: {
        pending: false,
        error: null,
    },
} 

export function auth(state = defaultState.auth,action: Actions):State["auth"] {
    switch (action.type) {
        case "auth/login/fulfilled":
            return  true;
        case "auth/logout":
            return  false;
        default:
            return state;
    }
}

export function adverts(state = defaultState.adverts,action: Actions):State["adverts"] {
    switch (action.type) {
        case "adverts/loaded/fulfilled":
            return action.payload;
        case "adverts/created/fulfilled":
            return { ...state, data:[ ... (state.data ?? []), action.payload] };
        default:
            return state;
    }
}

export function ui(state = defaultState.ui, action: Actions) :State[ "ui" ] {
    switch (action.type)  {
        case "ui/reset-error":
            return {...state, error: null};
        case "auth/login/pending":
            return {pending: true, error: null};
        case "auth/login/fulfilled":
            return {pending: false, error: null};
        case "auth/login/rejected":
            return {pending: false, error: action.payload};
        default:
            return state;
    }
}
