import type { Advert } from "../pages/adverts/types";
import type { Actions } from "./actions";

export type State = {
    auth: boolean;
    rememberMe: boolean; // Añadir el estado rememberMe
    adverts: { data: Advert[] | null, loaded: boolean };
    ui: {
        pending: boolean;
        error: Error | null;
    };
    tags: {
        data: string[] | null,
        pending: boolean,
        error: Error | null,
    }
}

const defaultState: State = {
    auth: false,
    rememberMe: false, // Estado inicial de rememberMe
    adverts: { data: null, loaded: false },
    ui: {
        pending: false,
        error: null,
    },
    tags: {
        data: null,
        pending: false,
        error: null,
    }
}

export function tags(state = defaultState.tags, action: Actions): State["tags"] {
    switch (action.type) {
        case "tags/loaded/pending":
        return { ...state, pending: true, error: null };
        case "tags/loaded/fulfilled":
        return { ...state, pending: false, data: action.payload };
        case "tags/loaded/rejected":
        return { ...state, pending: false, error: action.payload };
        default:
        return state;
    }
}

export function auth(state = defaultState.auth, action: Actions): State["auth"] {
    switch (action.type) {
        case "auth/login/fulfilled":
        return true;
        case "auth/logout":
        return false;
        default:
        return state;
    }
}

export function rememberMe(state = defaultState.rememberMe, action: Actions): State["rememberMe"] {
    switch (action.type) {
        case "auth/set-remember-me":
        return action.payload;
        default:
        return state;
    }
}

export function adverts(state = defaultState.adverts, action: Actions): State["adverts"] {
    switch (action.type) {
        case "adverts/loaded/fulfilled":
            return action.payload;
        case "adverts/created/fulfilled":
            return { ...state, data: [...(state.data ?? []), action.payload] };
        case "adverts/deleted/pending":
            return state;
        case "adverts/deleted/fulfilled":
            return { ...state, data: state.data ? state.data.filter(advert => advert.id !== action.payload) : null };
        case "adverts/deleted/rejected":
            return state;
        default:
            return state;
    }
}

export function ui(state = defaultState.ui, action: Actions): State["ui"] {
    switch (action.type) {
        case "ui/reset-error":
            return { ...state, error: null };
        case "auth/login/pending":
            return { pending: true, error: null };
        case "auth/login/fulfilled":
            return { pending: false, error: null };
        case "auth/login/rejected":
            return { pending: false, error: action.payload };
        default:
            return state;
    }
}