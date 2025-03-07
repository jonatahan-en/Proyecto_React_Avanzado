import type { Credentials } from "@/pages/auth/types";
import type { Advert, CreateAdvertDto } from "../pages/adverts/types";
import { isApiClientError } from "@/api/error";
import { login, logout } from "@/pages/auth/service";
import type { AppThunk } from ".";
import { createAdvert, deleteAdvert, getAdvert, getAdverts, getTags } from "@/pages/adverts/service";
import { getAdvertSelector } from "./selectors";

// para manejar el login en redux  
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
// para manejar los anuncios en redux
type AdvertsLoadedPending = {
    type: "adverts/loaded/pending";
};
type AdvertsLoadedFulfilled = {
    type: "adverts/loaded/fulfilled";
    payload: { data: Advert[], loaded: boolean };
};
type AdvertsLoadedRejected = {
    type: "adverts/loaded/rejected";
    payload: Error;
}
// para manejar la carga de tags en redux
type TagsLoadedPending = {
    type: "tags/loaded/pending";
};
type TagsLoadedFulfilled = {
    type: "tags/loaded/fulfilled";
    payload: string[];
};
type TagsLoadedRejected = {
    type: "tags/loaded/rejected";
    payload: Error;
}

// para manejar la creacion de anuncios en redux
type AdvertsCreatedPending = {
    type: "adverts/created/pending";
};
type AdvertsCreatedFulfilled = {
    type: "adverts/created/fulfilled";
    payload: Advert;
};
type AdvertsCreatedRejected = {
    type: "adverts/created/rejected";
    payload: Error;
}; 

type AdvertsDeletedPending = {
    type: "adverts/deleted/pending";
};
type AdvertsDeletedFulfilled = {
    type: "adverts/deleted/fulfilled";
    payload: string;
};
type AdvertsDeletedRejected = {
    type: "adverts/deleted/rejected";
    payload: Error;
};
type AuthSetRememberMe = {
    type: "auth/set-remember-me";
    payload: boolean;
};

type uiResetError = {
    type: "ui/reset-error";
}

export const authSetRememberMe = (rememberMe: boolean): AuthSetRememberMe => ({
    type: "auth/set-remember-me",
    payload: rememberMe,
});

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
// esta funcion es un thunk que se encarga de hacer el login y despues de hacerlo dispara las acciones de login fulfilled o rejected
export const authLogin = (credentials: Credentials, rememberMe: boolean): AppThunk<Promise<void>> => {
    return async (dispatch) => {
        dispatch(authLoginPending());
        try {
            await login(credentials, rememberMe);
            dispatch(authLoginFulfilled());
        } catch (error) {
            if (error instanceof Error) {
                dispatch(authLoginRejected(error));
            } else {
                dispatch(authLoginRejected(new Error("An unknown error occurred")));
            }
        }
    };
};

export const authLogout = (): AppThunk<Promise<void>> => {
    return async (dispatch, getState) => {
        const state = getState();
        const rememberMe = state.rememberMe;
        if (!rememberMe) {
            await logout();
        }
        dispatch({ type: "auth/logout" });
    };
};

export const advertsLoadedPending = (): AdvertsLoadedPending => ({
    type: "adverts/loaded/pending",
});
export const advertsLoadedFulfilled = (
    adverts: Advert[], 
    loaded?: boolean
): AdvertsLoadedFulfilled => ({
    type: "adverts/loaded/fulfilled",
    payload: { data: adverts, loaded: !!loaded },
});
export const advertsLoadedRejected = (error: Error): AdvertsLoadedRejected => ({
    type: "adverts/loaded/rejected",
    payload: error,
});
// esta funcion es un thunk que se encarga de cargar los anuncios y despues de hacerlo dispara las acciones de advertsLoadedFulfilled o advertsLoadedRejected
export function advertsLoaded(): AppThunk<Promise<void>> { 
    return async function(dispatch, getState){
        const state = getState();
        if(state.adverts.loaded){
            return;
        }
        dispatch(advertsLoadedPending());
        try {
            const adverts = await getAdverts();
            dispatch(advertsLoadedFulfilled(adverts, true));
        } catch (error) {
            if(isApiClientError(error)){
                dispatch(advertsLoadedRejected(error));
            }
        }
    }
}

export const tagsLoadedPending = (): TagsLoadedPending => ({
    type: "tags/loaded/pending",
});
export const tagsLoadedFulfilled = (tags: string[]): TagsLoadedFulfilled => ({
    type: "tags/loaded/fulfilled",
    payload: tags,
});
export const tagsLoadedRejected = (error: Error): TagsLoadedRejected => ({
    type: "tags/loaded/rejected",
    payload: error,
});

// esta funcion es un thunk que se encarga de cargar los tags y despues de hacerlo dispara las acciones de tagsLoadedFulfilled o tagsLoadedRejected
export function LoadTags(): AppThunk<Promise<void>> {
    return async function(dispatch) {
        dispatch(tagsLoadedPending());
        try {
            const tags = await getTags();
            dispatch(tagsLoadedFulfilled(tags));
        } catch (error) {
            if(isApiClientError(error)){
                dispatch(tagsLoadedRejected(error));
            }
        }
    }
}

// esta funcion es un thunk que se encarga de cargar un anuncio y despues de hacerlo dispara las acciones de advertsLoadedFulfilled o advertsLoadedRejected
export function advertLoadedDetail(advertId: string): AppThunk<Promise<void>> { 
    return async function(dispatch, getState){
        const state = getState();
        if(getAdvertSelector(advertId)(state)){
            return;
        }
        dispatch(advertsLoadedPending());
        try {
            const advert= await getAdvert(advertId);
            dispatch(advertsLoadedFulfilled([advert]));
        } catch (error) {
            if(isApiClientError(error)){
                dispatch(advertsLoadedRejected(error));
            }
        }
    }
}

export const advertCreatedpending = (): AdvertsCreatedPending  => ({
    type: "adverts/created/pending",   
});
export const advertCreatedFulfilled = (advert: Advert): AdvertsCreatedFulfilled => ({
    type: "adverts/created/fulfilled",
    payload: advert,
});
export const advertCreatedRejected = (error: Error): AdvertsCreatedRejected => ({
    type: "adverts/created/rejected",
    payload: error,
})

// esta funcion es un thunk que se encarga de crear un anuncio y despues de hacerlo dispara las acciones de advertCreatedFulfilled o advertCreatedRejected
export function advertsCreate(
    advertDto: CreateAdvertDto,
): AppThunk<Promise<Advert>> {
    return async function(dispatch) {
        dispatch(advertCreatedpending());
        try {
            const createdAdvert = await createAdvert(advertDto);
            const advert = await getAdvert(createdAdvert.id);
            dispatch(advertCreatedFulfilled(advert));
            return advert;
        } catch (error) {
            if(isApiClientError(error)){
                dispatch(advertCreatedRejected(error));
            }
            throw error;
        }
    }
}

export const advertDeletedPending = (): AdvertsDeletedPending => ({
    type: "adverts/deleted/pending",
});
export const advertDeletedFulfilled = (advertId: string): AdvertsDeletedFulfilled => ({
    type: "adverts/deleted/fulfilled",
    payload: advertId,
});
export const advertDeletedRejected = (error: Error): AdvertsDeletedRejected => ({
    type: "adverts/deleted/rejected",
    payload: error,
});

// esta funcion es un thunk que se encarga de borrar un anuncio y despues de hacerlo dispara las acciones de advertDeletedFulfilled o advertDeletedRejected
export function advertsDelete(advertId: string): AppThunk<Promise<void>> {
    return async function(dispatch) {
        dispatch(advertDeletedPending());
        try {
            await deleteAdvert(advertId);
            dispatch(advertDeletedFulfilled(advertId));
        } catch (error) {
            if(isApiClientError(error)){
                dispatch(advertDeletedRejected(error));
            }
        }
    }
}

export const uiResetError = (): uiResetError => ({
    type: "ui/reset-error",
});

export type Actions = 
| AuthLoginPending
| AuthLoginFulfilled
| AuthLoginRejected 
| AuthLogout 
| AdvertsLoadedPending
| AdvertsLoadedFulfilled
| AdvertsLoadedRejected 
| AdvertsCreatedPending
| AdvertsCreatedFulfilled
| AdvertsCreatedRejected
| TagsLoadedPending
| TagsLoadedFulfilled
| TagsLoadedRejected
| AdvertsDeletedPending
| AdvertsDeletedFulfilled
| AdvertsDeletedRejected
| AuthSetRememberMe
| uiResetError;