import type { RootState } from ".";

export const getIsLogged = (state: RootState) => state.auth;

export const getAdvertsSelector = (state: RootState) => state.adverts ?? [];

export const getAdvertSelector = (advertId?: string) => (state: RootState ) =>
    state.adverts ?.find((advert) => advert.id === advertId);


export const getUiSelector = (state: RootState) => state.ui;