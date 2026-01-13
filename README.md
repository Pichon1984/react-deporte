# React Deporte — Frontend (Vite + React)

Descripción
 e-commerce deportivo construida con Vite + React. El frontend consume una API externa definida por la variable de entorno `VITE_API_URL`. Usa Context para autenticación y carrito.

Requisitos
- Node.js 18+ (recomendado 18/20)
- npm o yarn

Instalación y ejecución
```bash
npm install
npm run dev       # inicia servidor de desarrollo (Vite)
npm run build     # genera build de producción
npm run preview   # sirve la build localmente
npm run lint      # corre ESLint
```

Variables de entorno
- `VITE_API_URL` — URL base de la API (ej. `http://localhost:3000`). El proyecto usa `import.meta.env.VITE_API_URL`.
- En desarrollo el token se guarda en `localStorage` bajo la clave `token`. En producción el backend suele usar sesiones/cookies.

Arquitectura y flujo principal
- Entrada: `src/main.jsx` — envuelve `App` con `AuthProvider` y `CarritoProvider`.
- Autenticación: `src/context/AuthContext.jsx`
  - En DEV: rehidrata token desde `localStorage` y usa header `x-token`.
  - En PROD: usa `credentials: "include"` y cookies; endpoints esperan sesión.
- Llamadas a API:
  - Helpers específicos: `src/services/api.js` — exporta funciones (p. ej. `getProductoById`, `login`, `getCarrito`) y el `API_URL`.
  - Wrapper genérico: `src/services/http.js` — `httpGet/httpPost/httpPut/httpDelete` usan `x-token` y `credentials: "include"`.
- Estado y UI:
  - Contexts: `src/context/` (Auth, Carrito).
  - Páginas: `src/PagesPrincipal/`.
  - Componentes reutilizables: `src/components/`.

Convenciones del proyecto (específicas)
- Header de autorización: usa `x-token` en desarrollo; no confundir con `Authorization: Bearer`.
- Respuestas: `src/services/api.js` devuelve objetos `{ ok, status, data }`. `src/services/http.js` lanza `Error` para estados no-ok.
- Persistencia local en DEV: `localStorage.token` es la fuente para rehidratación.
- Separación clara: lógica HTTP en `services/`, UI en `components/`, estado global en `context/`.

Integraciones externas visibles
- Cloudinary — componente `src/components/CloudinaryUpload.jsx`.
- MercadoPago — `src/components/PagoMercadoPago.jsx` y `@mercadopago/sdk-react` en `package.json`.
- EmailJS — usado en `src/components/FormularioContacto.jsx`.

Depuración rápida
- Problemas de autenticación en desarrollo: verificar `localStorage.token` y que `VITE_API_URL` apunte al backend correcto.
- Para probar endpoints: setear `.env` con `VITE_API_URL=http://localhost:3000` y reiniciar `npm run dev`.
- Logs: `AuthContext` ya imprime errores con `console.error` para rehidratación.

Archivos para revisar al entrar al proyecto
- `src/main.jsx`
- `src/App.jsx`
- `src/context/AuthContext.jsx`
- `src/services/api.js`
- `src/services/http.js`
- `src/components/Header.jsx`
- `src/PagesPrincipal/Inicio.jsx`

Contribuir rápido
- Seguir la separación `components/` vs `PagesPrincipal/` vs `services/` vs `context/`.
- Ejecutar `npm run lint` antes de crear PR.
- Si añadís llamadas a API, agregalas a `src/services/api.js` o a `http.js` según convenga.

¿Querés que aplique este `README.md` directamente en el archivo `README.md` del repositorio o preferís ajustar algo antes?
# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
