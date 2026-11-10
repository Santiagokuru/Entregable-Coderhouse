# Entrega 2 - API de Servicios

API REST con Node.js (ESM) y Express para gestionar los servicios de un consultorio odontológico, pensada para un sistema de turnos y reservas. Ofrece un CRUD completo sobre el recurso `services`.

## Instalación

```bash
npm install
```

Crear un archivo `.env` en la raíz del proyecto (se puede usar `.env.example` como plantilla).

## Ejecución

```bash
npm start
```

Ejecuta `node --watch src/app.js`, que reinicia el servidor al guardar cambios. Al arrancar imprime en consola el puerto en el que escucha (por defecto `http://localhost:8080`).

## Variables de entorno

| Variable   | Descripción                                             | Ejemplo       |
|------------|---------------------------------------------------------|---------------|
| `PORT`     | Puerto de la aplicación. Si no está definida, usa 8080  | `8080`        |
| `NODE_ENV` | Entorno de ejecución (definida en `.env`, aún no usada) | `development` |

El archivo `.env` está en `.gitignore` y no se sube al repositorio; `.env.example` sí.

## Estructura

```
src/
  app.js                       # Servidor Express y endpoints
  server.js                    # Script de la entrega 1 (ver nota)
  config/config.js
  managers/ServiceManager.js   # Clase de la entrega 1 (ver nota)
.env
.env.example
.gitignore
package.json
```

> Nota: la API de esta entrega vive completa en `src/app.js` y guarda los datos en un arreglo en memoria. `src/server.js` y `src/managers/ServiceManager.js` vienen de la entrega 1 y `app.js` no los usa.

## Recurso `services`

Cada servicio tiene esta forma:

```json
{
  "id": 1,
  "name": "Extraccion de diente",
  "precio": 4000,
  "tiempo": 5000,
  "descripcion": "extraccion simple de muelas de juicio"
}
```

| Campo         | Descripción                                        |
|---------------|----------------------------------------------------|
| `id`          | Identificador. Los servicios iniciales usan 1, 2 y 3 |
| `name`        | Nombre del servicio                                |
| `precio`      | Precio                                             |
| `tiempo`      | Duración                                           |
| `descripcion` | Descripción del servicio                           |

Los servicios viven solo en memoria: se pierden al reiniciar el servidor. Arranca con tres servicios cargados.

## Endpoints

Todas las respuestas son JSON con la forma `{ "status": "success" | "error", ... }`.

| Método   | Ruta                 | Descripción                  |
|----------|----------------------|------------------------------|
| `GET`    | `/api/services`      | Lista todos los servicios    |
| `GET`    | `/api/services/:sid` | Devuelve un servicio por id  |
| `POST`   | `/api/services`      | Crea un servicio             |
| `PUT`    | `/api/services/:sid` | Reemplaza un servicio        |
| `DELETE` | `/api/services/:sid` | Elimina un servicio          |

### `GET /api/services`

Respuesta `200`:

```json
{ "status": "success", "payload": [ { "id": 1, "name": "...", "precio": 4000, "tiempo": 5000, "descripcion": "..." } ] }
```

### `GET /api/services/:sid`

Respuesta `200` con el servicio en `payload`, o `404` con `"Servicio no encontrado"`.

### `POST /api/services`

Body (JSON):

```json
{
  "name": "Placa Dental",
  "precio": 15000,
  "tiempo": 200,
  "descripcion": "placa de relajacion para bruxismos"
}
```

- `name`, `precio` y `tiempo` son obligatorios. Si falta alguno responde `400` con `"Faltan campos obligatorios"`.
- `descripcion` es opcional.
- Respuesta `201` con el servicio creado en `payload`.

### `PUT /api/services/:sid`

Reemplaza el servicio completo con los campos del body (mismos campos que en el `POST`), conservando el `id`. Respuesta `200` con el servicio actualizado, o `404` con `"servicio no encontrado"` si no existe. No valida los campos: los que no se envían quedan en `undefined`.

### `DELETE /api/services/:sid`

Elimina el servicio. Respuesta `200` con el servicio eliminado en `payload`, o `404` con `"servicio no encontrado"`.

## Limitaciones conocidas

- Los servicios creados con `POST` reciben un UUID como `id`, pero las rutas con `:sid` convierten el parámetro con `Number()`. Por eso esos servicios no se pueden consultar, editar ni borrar por id hasta unificar el tipo de `id`.
- El `PUT` reemplaza el servicio completo sin validar: si el body no trae todos los campos, los que faltan quedan en `undefined`.
- No hay persistencia: los datos se pierden al reiniciar.
