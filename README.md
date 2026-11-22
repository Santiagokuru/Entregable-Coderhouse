# Entrega 2 - API de Servicios y Reservas

API REST con Node.js (ESM) y Express para un consultorio odontológico. Ofrece un CRUD completo sobre dos recursos: `services` (los servicios que ofrece el consultorio) y `bookings` (las reservas de turnos). Los datos se guardan en archivos JSON dentro de `src/data/`.

## Instalación

```bash
npm install
```

Crear un archivo `.env` en la raíz del proyecto (se puede usar `.env.example` como plantilla).

## Ejecución

```bash
npm start
```

Ejecuta `node --watch src/server.js`, que reinicia el servidor al guardar cambios (`npm run dev` hace lo mismo). Al arrancar imprime en consola el puerto en el que escucha (por defecto `http://localhost:8080`). Cada petición que llega se registra en consola con su método y su URL.

## Variables de entorno

| Variable   | Descripción                                             | Ejemplo       |
|------------|---------------------------------------------------------|---------------|
| `PORT`     | Puerto de la aplicación. Si no está definida, usa 8080  | `8080`        |
| `NODE_ENV` | Entorno de ejecución (definida en `.env`, aún no usada) | `development` |

El archivo `.env` está en `.gitignore` y no se sube al repositorio; `.env.example` sí.

## Estructura

```
src/
  server.js                    # Servidor Express y endpoints (punto de entrada)
  config/config.js             # Carga .env y expone el puerto
  managers/
    ServiceManager.js          # Lee y escribe src/data/services.json
    BookingManager.js          # Lee y escribe src/data/booking.json
  middlewares/
    routingDetector.js         # Registra método y URL de cada petición
  data/
    services.json              # Servicios guardados
    booking.json               # Reservas guardadas
  app.js                       # Versión anterior con datos en memoria (no se usa)
.env
.env.example
.gitignore
package.json
```

Cada manager es una clase que recibe la ruta de su archivo JSON y expone métodos asíncronos para leer, crear, actualizar y borrar. `server.js` crea una instancia de cada uno y los usa en las rutas.

## Respuestas

Todas las respuestas son JSON con la forma `{ "status": "success" | "error", ... }`.

- Éxito: `status: "success"` y, según el caso, `payload` (los datos) y `message`.
- Recurso inexistente: `404` con `status: "error"` y un `message`.
- Datos incompletos en un `POST`: `400` con `"Faltan campos obligatorios"`.
- Error interno (por ejemplo, un archivo JSON ilegible): `500` con `status: "error"` y el `message` del error.

## Recurso `services`

```json
{
  "id": "2",
  "name": "Consulta detal",
  "precio": 3000,
  "tiempo": 3000,
  "descripcion": "Consulta con un profesional odontologio"
}
```

| Campo         | Descripción                                                |
|---------------|------------------------------------------------------------|
| `id`          | Identificador (string). Los servicios nuevos usan un UUID  |
| `name`        | Nombre del servicio                                        |
| `precio`      | Precio                                                     |
| `tiempo`      | Duración                                                   |
| `descripcion` | Descripción del servicio                                   |

### Endpoints de servicios

| Método   | Ruta                 | Descripción                  |
|----------|----------------------|------------------------------|
| `GET`    | `/api/services`      | Lista todos los servicios    |
| `GET`    | `/api/services/:sid` | Devuelve un servicio por id  |
| `POST`   | `/api/services`      | Crea un servicio             |
| `PUT`    | `/api/services/:sid` | Actualiza un servicio        |
| `DELETE` | `/api/services/:sid` | Elimina un servicio          |

**`POST /api/services`**

```json
{
  "name": "Placa Dental",
  "precio": 15000,
  "tiempo": 200,
  "descripcion": "placa de relajacion para bruxismos"
}
```

- `name`, `precio` y `tiempo` son obligatorios; `descripcion` es opcional.
- Respuesta `201` con el servicio creado en `payload`.

**`PUT /api/services/:sid`**

Combina los campos del body con el servicio existente: los campos que no se envían conservan su valor. Respuesta `200` con el servicio actualizado, o `404` si no existe.

**`DELETE /api/services/:sid`**

Respuesta `200` con el servicio eliminado en `payload`, o `404` si no existe.

## Recurso `bookings`

```json
{
  "id": "1",
  "clientName": "Consulta detal",
  "clientEmail": "hola@test.com",
  "date": 3000,
  "time": 3500,
  "status": "available",
  "services": [
    { "service": "1", "quantity": 1 }
  ]
}
```

| Campo         | Descripción                                                          |
|---------------|----------------------------------------------------------------------|
| `id`          | Identificador (string). Las reservas nuevas usan un UUID             |
| `clientName`  | Nombre del cliente                                                   |
| `clientEmail` | Email del cliente                                                    |
| `date`        | Fecha de la reserva                                                  |
| `time`        | Hora de la reserva                                                   |
| `status`      | Estado de la reserva. Si no se envía, vale `"available"`             |
| `services`    | Lista de servicios reservados: `service` (id del servicio) y `quantity` |

### Endpoints de reservas

| Método   | Ruta                 | Descripción                  |
|----------|----------------------|------------------------------|
| `GET`    | `/api/bookings`      | Lista todas las reservas     |
| `GET`    | `/api/bookings/:bid` | Devuelve una reserva por id  |
| `POST`   | `/api/bookings`      | Crea una reserva             |
| `PUT`    | `/api/bookings/:bid` | Actualiza una reserva        |
| `DELETE` | `/api/bookings/:bid` | Elimina una reserva          |

**`POST /api/bookings`**

```json
{
  "clientName": "Ana",
  "clientEmail": "ana@test.com",
  "date": "2026-12-01",
  "time": "10:30",
  "services": [
    { "service": "2", "quantity": 1 }
  ]
}
```

- `clientName`, `clientEmail`, `date`, `time` y `services` son obligatorios. `services` tiene que ser una lista con al menos un elemento.
- `status` es opcional y por defecto vale `"available"`.
- Respuesta `201` con la reserva creada en `payload`.

**`PUT /api/bookings/:bid`**

Combina los campos del body con la reserva existente. El `id` no se puede modificar aunque venga en el body. Respuesta `200` con la reserva actualizada, o `404` si no existe.

**`DELETE /api/bookings/:bid`**

Respuesta `200` con la reserva eliminada en `payload`, o `404` si no existe.

## Limitaciones conocidas

- El `POST` de reservas no verifica que los ids de `services` correspondan a servicios existentes.
- El `PUT` no valida los campos del body.
- El `PUT` de servicios permite cambiar el `id` desde el body.
- Los datos viven en archivos JSON: sirven para esta entrega, pero no soportan accesos concurrentes. Dos peticiones simultáneas que escriban pueden pisarse.
- Cada vez que se escribe un archivo JSON se reformatea con 2 espacios de indentación.
