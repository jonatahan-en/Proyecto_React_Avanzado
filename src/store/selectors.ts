import type { RootState } from ".";

export const getIsLogged = (state: RootState) => state.auth;

export const getAdvertsSelector = (state: RootState) =>
    state.adverts.data || [];

export const getAdvertSelector = (advertId?: string) => (state: RootState) =>
    state.adverts.data?.find((advert) => advert.id === advertId);

export const getTagsSelector = (state: RootState) => state.tags.data || [];
export const getTagsPendingSelector = (state: RootState) => state.tags.pending;
export const getTagsErrorSelector = (state: RootState) => state.tags.error;

export const getUiSelector = (state: RootState) => state.ui;
