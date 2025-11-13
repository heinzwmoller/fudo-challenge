# Redium (Reddit + Medium para los curiosos 👀)

Una aplicación tipo foro construida con React 19, Vite y React Query. Básicamente, te permite explorar posts, crear contenido y responder hilos anidados usando la API pública que viene con la prueba técnica.

## Características principales

- **Autenticación simulada**: Hay un formulario de login que acepta cualquier correo y contraseña (sí, cualquiera). La sesión se guarda en `localStorage`, así que si recargas la página sigues logueado. Una vez dentro, tu avatar aparece en el navbar con un menú para gestionar tu sesión.

- **Listado de posts con paginado**: Usamos `useInfiniteQuery` para cargar posts de a 20. Como la API no nos dice cuándo terminan los resultados, asumimos que ya no hay más cuando devuelve menos de 20. Puedes cargar más con un botón o volver arriba con el botón flotante.

- **Detalle del post y comentarios**:
  - Puedes crear, editar y borrar comentarios con actualizaciones optimistas (la UI responde al instante).
  - Los comentarios se organizan en un árbol anidado con guías visuales para seguir el hilo.
  - Si la API deja comentarios "huérfanos" (por ejemplo, cuando borras un padre), los filtramos automáticamente para que no aparezcan como comentarios de nivel raíz.
  - Si un post no existe, mostramos una página 404 amigable en lugar de un error genérico.

- **Interacciones sociales**:
  - Cada post y comentario tiene un contador de likes local. El número inicial es pseudoaleatorio (basado en el `id`) y puedes dar/quitar like con un click. El corazón cambia de outline a sólido cuando le das like.
  - Hay un botón para compartir posts que abre un modal con la URL copiable.

- **Experiencia de usuario**: Modales de confirmación para acciones destructivas, manejo de errores consistente y estados skeleton mientras carga la información.

## Estrategia de data fetching

Aquí te explico cómo manejamos la data en cada parte de la app:

| Recurso         | Hook                            | Estrategia                                                                                                                                                                                           |
| --------------- | ------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Posts           | `usePosts` (`useInfiniteQuery`) | Paginado incremental de 20 en 20. Como la API no nos dice cuándo terminan los resultados, asumimos que ya no hay más cuando devuelve menos de 20. Cacheamos por página y optimizamos las mutaciones. |
| Post individual | `usePost`                       | Query estándar que se invalida automáticamente cuando editas o borras el post.                                                                                                                       |
| Comentarios     | `useComments`                   | Query estándar que se invalida en cada mutación. `buildCommentTree` reconstruye el árbol en memoria y filtra respuestas huérfanas para mantener la estructura limpia.                                |

## Rutas principales

Estas son las rutas que tiene la aplicación:

- `/login`: Página de login simulado. Cualquier correo y contraseña funcionan, y la sesión se guarda en `localStorage`.
- `/` (Inicio): Listado de posts con formulario para crear nuevos y paginado incremental.
- `/posts/:postId`: Detalle del post con su árbol de comentarios, likes locales y botón para compartir.
- `/account`: Información básica de tu cuenta (avatar, nombre y correo).
- `/help`: Centro de ayuda con preguntas frecuentes en formato colapsable.
- `*`: Cualquier otra ruta que no exista te lleva a la página de `NotFound`.

## Scripts

Los comandos que necesitas para trabajar con el proyecto:

```bash
# Instalar dependencias
npm install

# Servidor de desarrollo
npm run dev

# Linter
npm run lint

# Tests con Vitest
npm run test

# Build de producción
npm run build

# Build Docker (ver sección Docker)
docker build -t fudo-challenge .
docker run -p 8080:80 fudo-challenge
```

## Pruebas

Tenemos tests para:

- `PostInput` y `ErrorState`: comportamiento básico de la UI.
- `buildCommentTree`: incluye el caso de comentarios huérfanos para asegurar que se filtran correctamente.
- `useCommentItem`: verifica que se resetean los errores al cancelar una respuesta.
- `PostsList.test.tsx`: valida la integración del paginado, incluyendo el render de posts y el botón "Quiero más posts! ...".

> Tip: Ejecuta `npm run test` después de modificar la lógica de fetching o los componentes principales para asegurarte de que todo sigue funcionando.

## Consideraciones conocidas

Hay algunas cosas que debes tener en cuenta:

- **Limitaciones de la API**: La API no nos dice cuántos posts o comentarios hay en total, ni nos da un cursor para la siguiente página. Por eso, asumimos que ya no hay más resultados cuando la respuesta trae menos elementos que el límite que pedimos. También, cuando borras un comentario padre que tiene hijos, la API no hace nada con esos hijos. Nosotros los filtramos en el frontend para que no aparezcan como comentarios de nivel raíz.

- **Scroll-to-top**: El botón flotante para volver arriba aparece después de hacer scroll unos 400px y usa `window.scrollTo` con animación suave.

## Futuras mejoras sugeridas

Cosas que podrían ser útiles agregar en el futuro:

- Mostrar notificaciones (toast) cuando se detecten comentarios huérfanos que fueron filtrados. (No se agregó para favorecer la simplicidad)
- Evaluar infinite scroll automático para posts y cargar respuestas bajo demanda si el backend lo soporta.
- Mostrar un tag "Editado" cuando existan marcas `updatedAt` en posts y comentarios.
- Agregar opciones de compartir en redes sociales (Instagram, LinkedIn, Facebook, etc.) desde el modal de compartir.
- Mostrar un contador de comentarios por post en el listado, idealmente usando un `commentsCount` que venga desde la API.

## Observaciones sobre la API externa

Durante la implementación nos encontramos con algunas limitaciones del servicio mock. No todas se pueden corregir desde el frontend, pero conviene tenerlas documentadas:

- No viene `updatedAt` en los recursos, así que no podemos mostrar un tag "Editado" de manera limpia en posts y comentarios.
- La API ignora el `postId` cuando actualizas o eliminas comentarios; solo usa el `commentId`, aunque la ruta lo solicite.
- Al borrar un comentario que tiene respuestas, no hace delete cascade. Los hijos pierden el padre pero su parentId no se elimina, lo que generaba un comportamiento inconsistente en el front.
- Cuando no hay comentarios, devuelve 404 en vez de un array vacío. Mostramos un mensaje amigable pero registramos la anomalía.
- Las fechas de creación no son consistentes, así que enviamos `createdAt` desde el frontend como workaround.
- Los errores del backend a veces llegan como string plano (sin JSON), por lo que `serializeError` se queda con un mensaje genérico.
- Falta un delete cascade en posts y comentarios. En el cliente filtramos manualmente los huérfanos para evitar confusiones.

## Docker

La aplicación incluye un `Dockerfile` multi-stage y una configuración de Nginx (`nginx.conf`) para servir la build estática.

```bash
# Construir la imagen
docker build -t fudo-challenge .

# Ejecutar el contenedor (sirve en http://localhost:8080)
docker run --rm -p 8080:80 fudo-challenge
```

El servidor usa `nginx:alpine` y redirige todas las rutas al `index.html` para que React Router funcione correctamente con el enrutado del lado del cliente.
