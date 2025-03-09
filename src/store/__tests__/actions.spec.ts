
import { authLoginPending, advertsLoadedFulfilled } from "../actions";
import type { Advert } from "@/pages/adverts/types";


describe("authLoginPending", () => {
    test('should return an "auth/login/pending" action', () => {
        const action = {
        type: "auth/login/pending",
        };
        const result = authLoginPending();
        expect(result).toEqual(action);
    });
});
// test de accion sincrona advertsLoadedFulfilled
describe("advertsLoadedFulfilled", () => {
    const adverts: Advert[] = [
        {
            id: "1",
            name: "Example Advert",
            sale: true,
            price: 100,
            tags: ["example"],
            photo: "example.jpg",
        },
        ];

    test('should return an "adverts/loaded/fulfilled" action with loaded false', () => {
        const action = {
        type: "adverts/loaded/fulfilled",
        payload: { data: adverts, loaded: false },
        };
        const result = advertsLoadedFulfilled(adverts);
        expect(result).toEqual(action);
    });
    test('should return an "adverts/loaded/fulfilled" action with loaded true', () => {
        const action = {
        type: "adverts/loaded/fulfilled",
        payload: { data: adverts, loaded: true },
        };
        const result = advertsLoadedFulfilled(adverts, true);
        expect(result).toEqual(action);
        
    });
});

