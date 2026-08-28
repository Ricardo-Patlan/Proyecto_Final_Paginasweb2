# Biblioteca Digital

Proyecto final de Páginas Web 2. Es un sistema para administrar una biblioteca:
el admin da de alta categorías y libros, y cualquier usuario que se registre
puede pedir libros prestados. Cuando alguien pide un libro el stock baja solo,
y cuando el admin marca el préstamo como devuelto el stock vuelve a subir.

Hecho con:
- Backend: NestJS 11 + TypeORM, conectado a MariaDB. Login con JWT.
- Frontend: Angular (standalone + signals) con Tailwind y DaisyUI.

## Cómo está organizado

```
backend/    -> la API
frontend/   -> la app de angular
docs/       -> documentacion de la API y la coleccion de postman
```

## Antes de empezar

Necesitas tener instalado:
- Node
- Docker Desktop (para la base de datos)

## Paso 1: la base de datos

Entra a la carpeta backend y copia el archivo de variables de entorno:

```bash
cd backend
cp .env.template .env
```

Después abre ese `.env` que se creó y cambia la contraseña y el secreto del
JWT (los que vienen en el template son de ejemplo nada más, no los dejes
así).

Con Docker Desktop abierto:

```bash
docker compose up -d
```

Con esto se levanta un contenedor llamado `bibliotecadb` en el puerto 3309.

## Paso 2: correr el backend

```bash
cd backend
npm install
npm run start:dev
```

Va a quedar corriendo en `http://localhost:3000/api`.

### Llenar la base con datos de prueba

Con el backend ya corriendo, entra desde el navegador (o con un GET) a:

```
http://localhost:3000/api/seed
```

Esto limpia las tablas y mete usuarios, categorías y libros de ejemplo para
no tener que estar creando todo a mano. Los usuarios que quedan son estos:

| rol   | correo                | contraseña |
|-------|------------------------|------------|
| admin | admin@biblioteca.com   | Admin123   |
| user  | ana@biblioteca.com     | Lector123  |
| user  | carlos@biblioteca.com  | Lector123  |

## Paso 3: correr el frontend

En otra terminal (deja la del backend corriendo):

```bash
cd frontend
npm install
npm start
```

Se abre en `http://localhost:4200`. Ya está configurado para hablar con la
API en `http://localhost:3000/api`, eso se define en
`src/environments/environment.development.ts` por si algún día cambia el
puerto del backend.

## Documentación

En `docs/API.md` está la lista de los endpoints con lo que recibe cada uno.

También dejé una colección de Postman en
`docs/postman/Biblioteca-Digital.postman_collection.json` que se puede
importar directo. Al hacer login o registro ahí mismo se va guardando el
token en una variable, así que no hay que andar copiándolo a mano para las
demás peticiones.

## Roles

- **admin**: puede crear, editar y borrar categorías y libros. Ve todos los
  préstamos que hay y es quien los marca como devueltos.
- **user**: ve el catálogo, pide libros prestados y ve nada más los préstamos
  que él mismo ha hecho.
