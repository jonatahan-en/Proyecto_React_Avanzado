import { adverts, auth } from "../reducers";
import type { Advert } from "@/pages/adverts/types";

// Test del reducer auth
describe("auth reducer", () => {
    test('should manage "auth/login/fulfilled" action', () => {
        const result = auth(undefined, { type: "auth/login/fulfilled" });
        expect(result).toBe(true);
    });

    test('should manage "auth/logout" action', () => {
        const result = auth(undefined, { type: "auth/logout" });
        expect(result).toBe(false);
    });

    test("should manage any other action", () => {
        const result = auth(true, { type: "ui/reset-error" });
        expect(result).toBe(true);
    });
});

// Test del reducer adverts
describe("adverts reducer", () => {
    const advert: Advert = {
        id: "1",
        name: "test",
        price: 1,
        sale: true,
        tags: ["test"],
        photo: "test",
    };

    test('should manage "adverts/loaded/fulfilled" action', () => {
        const state = { data: null, loaded: false };
        const result = adverts(state, {
            type: "adverts/loaded/fulfilled",
            payload: { data: [advert], loaded: true },
        });
        expect(result).toEqual({ data: [advert], loaded: true });
    });

    test('should manage "adverts/created/fulfilled" action', () => {
        const state = { data: [], loaded: false };
        const result = adverts(state, {
            type: "adverts/created/fulfilled",
            payload: advert,
        });
        expect(result).toEqual({ data: [advert], loaded: false });
    });

    test('should manage "adverts/deleted/pending" action', () => {
        const state = { data: [advert], loaded: true };
        const result = adverts(state, { type: "adverts/deleted/pending" });
        expect(result).toEqual(state);
    });

    test('should manage "adverts/deleted/fulfilled" action', () => {
        const state = { data: [advert], loaded: true };
        const result = adverts(state, {
            type: "adverts/deleted/fulfilled",
            payload: "1",
        });
        expect(result).toEqual({ data: [], loaded: true });
    });

    test('should manage "adverts/deleted/rejected" action', () => {
        const state = { data: [advert], loaded: true };
        const error = new Error("Delete failed");
        const result = adverts(state, {
            type: "adverts/deleted/rejected",
            payload: error,
        });
        expect(result).toEqual(state);
    });

    test("should manage any other action", () => {
        const state = { data: [advert], loaded: true };
        const result = adverts(state, { type: "ui/reset-error" });
        expect(result).toEqual(state);
    });
});
