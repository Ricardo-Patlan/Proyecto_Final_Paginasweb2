# Endpoints de la API

Todo cuelga de `http://localhost:3000/api`.

Cuando digo "logueado" es que la petición necesita el header
`Authorization: Bearer <token>`. Cuando digo "admin" es lo mismo pero
además el usuario tiene que tener ese rol, si no le va a tirar 403.

Los GET que listan cosas (categorías, libros, préstamos) aceptan
`limit` y `offset` como query params por si se quiere paginar.

## Auth

**POST /auth/register** — crea la cuenta (queda como rol `user`) y de una
vez regresa el token.

```json
{
  "email": "ana@biblioteca.com",
  "password": "Lector123",
  "fullName": "Ana López"
}
```

La contraseña pide mínimo 6 caracteres, una mayúscula, una minúscula y un
número, si no la rechaza.

**POST /auth/login**

```json
{
  "email": "ana@biblioteca.com",
  "password": "Lector123"
}
```

**GET /auth/check-status** (logueado) — revisa que el token siga siendo
válido y de paso manda uno nuevo con el perfil completo.

## Categorías

Ruta base `/categories`.

- `POST /categories` (admin) — body: `name`, `description` (opcional)
- `GET /categories` (publico)
- `GET /categories/:term` (publico) — el `:term` puede ser el id o el nombre
- `PATCH /categories/:id` (admin)
- `DELETE /categories/:id` (admin)

## Libros

Ruta base `/books`.

- `POST /books` (admin) — body: `title`, `author`, `isbn`, y opcional
  `description`, `stock`, `categoryId`
- `GET /books` (publico)
- `GET /books/:term` (publico) — acepta id o el título del libro
- `PATCH /books/:id` (admin)
- `DELETE /books/:id` (admin)

`categoryId` tiene que ser el id de una categoría que ya exista, si no
tira 404.

## Préstamos

Ruta base `/loans`.

- `POST /loans` (logueado) — body `{ bookId }`, pide prestado ese libro
  para el usuario que mandó el token
- `GET /loans` (admin) — todos los préstamos, de todos los usuarios
- `GET /loans/mine` (logueado) — solo los préstamos del usuario actual
- `PATCH /loans/:id/return` (admin) — marca como devuelto

Cuando se crea un préstamo el stock del libro baja 1. Si ya no hay copias
(`stock < 1`) manda un 400. Cuando se marca como devuelto, el stock vuelve
a subir.

## Seed

**GET /seed** — borra lo que haya en las tablas y las vuelve a llenar con
usuarios, categorías y libros de ejemplo. Es solo para desarrollo, no
debería usarse en producción.
