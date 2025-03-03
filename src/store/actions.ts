import type { Advert } from "../pages/adverts/types";

type AuthLogin = {
    type: "auth/login";
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

// estas funciones llevan el nombre de actionscreeators y sirve para crear las acciones
export const authLogin = (): AuthLogin => ({
    type: "auth/login",
});

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


export type Actions = 
| AuthLogin 
| AuthLogout 
| AdvertsLoaded 
| advertsCreated;