import type { Advert } from "@/pages/adverts/types";
import type { RootState } from "..";
import { getAdvertSelector } from "../selectors";

describe("getAdvertSelector", () => {
    const advert: Advert = {
        id: "1",
        name: "test",
        price: 1,
        sale: true,
        tags: ["test"],
        photo: "test",
    };
    const state: RootState = {
        adverts: { data: [advert], loaded: true},
        auth: false,
        rememberMe: false,
        ui: {pending:false, error:null},
        tags: {data: [], pending: false, error: null},
    }
    test("should return a advert with the same id", () => {
        const result = getAdvertSelector("1")(state);
        expect(result).toEqual(advert);
    })
    test("should return a undefined", () => {
        const result = getAdvertSelector("2")(state);
        expect(result).toBeUndefined();
    })

});