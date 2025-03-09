
import type { Credentials } from "@/pages/auth/types";
import { authLoginPending, advertsLoadedFulfilled , authLogin} from "../actions";
import type { Advert } from "@/pages/adverts/types";
import { ApiClientError } from "@/api/error";



// test de accion sincrona authLoginPending
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

// test de accion asincrona authLogin
describe("authLogin", () => {
    afterEach(() => {
        dispath.mockClear();
        router.navigate.mockClear();
    })
    const credentials: Credentials = {
        email: "@juan.com",
        password: "password",
    };
    const rememberMe: boolean = true; 
    const thunk = authLogin(credentials, rememberMe);
    const dispath = vi.fn();
    const api ={
        auth: {
            login: vi.fn()
        }
    }
    const from = "/from";
    const router = {
        state: {location: {state: {from}}},
        navigate: vi.fn()
    }

    test("when login resolves", async () =>{
        api.auth.login= vi.fn().mockResolvedValue(undefined);
        // @ts-expect-error: no se necesita getState
        await thunk(dispath, undefined, {api, router});
        expect(dispath).toHaveBeenCalledTimes(2);
        expect(dispath).toHaveBeenNthCalledWith(1, {type: "auth/login/pending"});
        expect(dispath).toHaveBeenNthCalledWith(2, {type: "auth/login/fulfilled"});
        expect(api.auth.login).toHaveBeenCalledWith(credentials, rememberMe);
        expect(router.navigate).toHaveBeenCalledTimes(1);
        expect(router.navigate).toHaveBeenCalledWith(from, {replace: true});
    
    })

    test("when login rejects", async () =>{
        const error = new ApiClientError(new Error("UNAUTHORIZED"))
        api.auth.login= vi.fn().mockRejectedValue(error);
         // @ts-expect-error: no se necesita getState
        await thunk(dispath, undefined, {api, router});
        expect(dispath).toHaveBeenCalledTimes(2);
        expect(dispath).toHaveBeenNthCalledWith(1, {
            type: "auth/login/pending"});
        expect(dispath).toHaveBeenNthCalledWith(2, {
            type: "auth/login/rejected", 
            payload: error
        });
        expect(router.navigate).not.toHaveBeenCalled();
        expect(api.auth.login).toHaveBeenCalledWith(credentials, rememberMe);     
    })

})

