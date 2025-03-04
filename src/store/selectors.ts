import type { RootState } from ".";

export const getIsLogged = (state: RootState) => state.auth;

export const getAdvertsSelector = (state: RootState) => state.adverts;