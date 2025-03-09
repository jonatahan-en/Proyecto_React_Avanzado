import{ render } from "@testing-library/react";
import  LoginPage from "../login-page";
import { Provider } from "react-redux";



describe("LoginPage", () => {
    const state = {
        auth: false,
        rememberMe: false,
        adverts: { data: null, loaded: false },
        ui: {
            pending: false,
            error: null,
            },
        tags: {
            data: null,
            pending: false,
            error: null,
        },
    };

    test("shoult render ", () => {
        const {container} = render(
            <Provider store={{getState:() => state, subscribe: () => {}, dispatch: () => {}}}>
                <LoginPage />
            </Provider>,
        );
        expect(container).toMatchSnapshot();
        
    });
});

// problema con el store en el test de LoginPage, me devuelve un error (TypeError: window.matchMedia is not a function) que no se como solucionar
// el test de LoginPage no pasa
