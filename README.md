# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
    languageOptions: {
        // other options...
        parserOptions: {
            project: ["./tsconfig.node.json", "./tsconfig.app.json"],
            tsconfigRootDir: import.meta.dirname,
        },
    },
});
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from "eslint-plugin-react";

export default tseslint.config({
    // Set the react version
    settings: { react: { version: "18.3" } },
    plugins: {
        // Add the react plugin
        react,
    },
    rules: {
        // other rules...
        // Enable its recommended rules
        ...react.configs.recommended.rules,
        ...react.configs["jsx-runtime"].rules,
    },
});

```
# Migrando a Redux y Probando
Hemos actualizado nuestra aplicación para usar Redux para la gestión del estado. Esto incluye configurar acciones, reducers y selectores. A continuación, se ofrece una breve descripción de los cambios y cómo probarlos.

Configuración de Redux
Acciones: Define acciones para describir cambios en el estado.
Reducers: Crea reducers para manejar acciones y actualizar el estado.
Selectores: Escribe selectores para recuperar partes específicas del estado.
Probando Redux
 # Problemas 
  
Mientras configurábamos y probábamos nuestra componente LoginPge , encontramos un problema con la función window.matchMedia. Esta función no está disponible en el entorno de Node.js utilizado para las pruebas, lo que resulta en el siguiente error:

 - TypeError: window.matchMedia is not a function


