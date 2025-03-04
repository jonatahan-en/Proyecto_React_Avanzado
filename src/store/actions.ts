import type { Credentials } from "@/pages/auth/types";
import type { Advert } from "../pages/adverts/types";
import { isApiClientError } from "@/api/error";
import { login } from "@/pages/auth/service";
import type { AppThunk } from ".";


type AuthLoginPending = {
    type: "auth/login/pending";
};
type AuthLoginFulfilled = {
    type: "auth/login/fulfilled";
};

type AuthLoginRejected = {
    type: "auth/login/rejected";
    payload: Error;
};

type AuthLogout = {
    type: "auth/logout";
};

type AdvertsLoaded = {
    type: "adverts/loaded";
    payload: Advert[];
};

type advertsCreated = {
    type: "adverts/created";
    payload: Advert;
};
type uiResetError = {
    type: "ui/reset-error";
}

// estas funciones llevan el nombre de actionscreeators y sirve para crear las acciones
export const authLoginPending = (): AuthLoginPending => ({
    type: "auth/login/pending",
});
export const authLoginFulfilled = (): AuthLoginFulfilled => ({
    type: "auth/login/fulfilled",
});
export const authLoginRejected = (error: Error): AuthLoginRejected => ({
    type: "auth/login/rejected",
    payload: error,
});

export  function authLogin(
    credentials: Credentials
): AppThunk<Promise<void>> {
    return  async function(dispatch){
        dispatch(authLoginPending())
        try {
            await login(credentials, true);
            dispatch(authLoginFulfilled()); 
        } catch (error) {
            if(isApiClientError(error)){
                dispatch(authLoginRejected(error));
            }
        }
    };
}

export const authLogout = (): AuthLogout => ({
    type: "auth/logout",
});

export const advertsLoaded = (adverts: Advert[]): AdvertsLoaded => ({
    type: "adverts/loaded",
    payload: adverts,
});

export const advertCreated = (advert: Advert): advertsCreated => ({
    type: "adverts/created",
    payload: advert,
});

export const uiResetError = (): uiResetError => ({
    type: "ui/reset-error",
});


export type Actions = 
| AuthLoginPending
| AuthLoginFulfilled
| AuthLoginRejected 
| AuthLogout 
| AdvertsLoaded 
| advertsCreated
| uiResetError;