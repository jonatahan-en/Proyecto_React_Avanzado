import type { Credentials } from "@/pages/auth/types";
import type { Advert, CreateAdvertDto } from "../pages/adverts/types";
import { isApiClientError } from "@/api/error";
import { login } from "@/pages/auth/service";
import type { AppThunk } from ".";
import { createAdvert, getAdvert, getAdverts } from "@/pages/adverts/service";


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

type AdvertsLoadedPending = {
    type: "adverts/loaded/pending";
};
type AdvertsLoadedFulfilled = {
    type: "adverts/loaded/fulfilled";
    payload: Advert[];
};
type AdvertsLoadedRejected = {
    type: "adverts/loaded/rejected";
    payload: Error;
}

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



export const advertsLoadedPending = (): AdvertsLoadedPending => ({
    type: "adverts/loaded/pending",
});
export const advertsLoadedFulfilled = (adverts: Advert[]): AdvertsLoadedFulfilled => ({
    type: "adverts/loaded/fulfilled",
    payload: adverts,
});
export const advertsLoadedRejected = (error:Error): AdvertsLoadedRejected => ({
    type: "adverts/loaded/rejected",
    payload: error,
});

export function  advertsLoaded(): AppThunk<Promise<void>> { 
        return async function(dispatch, getState){
            const state = getState();
            if(state.adverts){
                return;
            }
            dispatch(advertsLoadedPending());
            try {
                const adverts = await getAdverts();
                dispatch(advertsLoadedFulfilled(adverts));
                
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
export const advertCreatedRejected = (error:Error): AdvertsCreatedRejected => ({
    type: "adverts/created/rejected",
    payload: error,
})

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
| uiResetError;