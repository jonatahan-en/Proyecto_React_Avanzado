
import type { Advert } from "../pages/adverts/types";
import type { Actions } from "./actions";

type State = {
    auth: boolean;
    adverts: Advert[];
}

const defaultState: State = {
    auth: false,
    adverts: [],
}   

export function reducer(state = defaultState, action: Actions): State {
    switch (action.type) {
        case "auth/login":
            return {...state , auth: true};
        case "auth/logout":
            return {...state , auth: false};
        case "adverts/loaded":
            return {...state , adverts: action.payload};
        case "adverts/created":
            return {...state , adverts: [...state.adverts, action.payload]};
    
        default:
            return state;
    }
}