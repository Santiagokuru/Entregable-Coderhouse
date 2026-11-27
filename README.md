# API de Servicios y Reservas

API REST con Node.js (ESM), Express y MongoDB (Mongoose) para un consultorio odontológico. Ofrece un CRUD completo sobre dos recursos: `services` (los servicios que ofrece el consultorio) y `bookings` (las reservas de turnos). Los datos se guardan en MongoDB, en las colecciones `services` y `bookings`.

## Instalación

```bash
npm install
```

Crear un archivo `.env` en la raíz del proyecto con las variables de la sección siguiente.

## Ejecución

```bash
npm start
```

Ejecuta `node --watch src/server.js`, que reinicia el servidor al guardar cambios (`npm run dev` hace lo mismo). Al arrancar se conecta a MongoDB (imprime `Conexion a MongoDB exitosa` o el error de conexión) y luego imprime el puerto en el que escucha (por defecto `http://localhost:8080`). Cada petición que llega se registra en consola con su método y su URL.

## Variables de entorno

| Variable            | Descripción                                                              | Ejemplo                                  |
|---------------------|--------------------------------------------------------------------------|------------------------------------------|
| `PORT`              | Puerto de la aplicación. Si no está definida, usa 8080                   | `8080`                                   |
| `Mongodb_conection` | URI de conexión a MongoDB (se escribe así, con ese nombre exacto)        | `mongodb+srv://usuario:clave@cluster/db` |
| `NODE_ENV`          | Entorno de ejecución (definida en `.env`, aún no usada)                  | `development`                            |

Si la URI no incluye el nombre de la base, MongoDB usa la base `test`. El archivo `.env` está en `.gitignore` y no se sube al repositorio. Como contiene la contraseña de la base, no hay que subirlo ni compartirlo.

## Estructura

El proyecto está organizado en capas. Cada capa solo conoce a la que tiene debajo:

```
router → controller → service → repository → dao → modelo (Mongoose) → MongoDB
```

```
src/
  server.js                       # Punto de entrada: conecta a MongoDB y levanta el servidor
  app.js                          # Crea la app de Express y monta las rutas
  config/
    config.js                     # Carga .env y expone el puerto y la URI de MongoDB
    database.config.js            # Conexión a MongoDB (connectDB)
  routes/
    services.router.js            # Rutas de /api/services
    bookings.router.js            # Rutas de /api/bookings
  controllers/
    services.controller.js        # Recibe la petición y arma la respuesta HTTP
    bookings.controller.js
  services/
    services.service.js           # Lógica de negocio: validaciones y errores
    bookings.service.js
  repositories/
    services.repository.js        # Intermediario entre el service y el dao
    bookings.repository.js
  daos/
    service.daos.js               # Consultas a la colección services
    booking.daos.js               # Consultas a la colección bookings
    models/
      service.models.js           # Esquema de Mongoose de los servicios
      booking.model.js            # Esquema de Mongoose de las reservas
  middlewares/
    routingDetector.js            # Registra método y URL de cada petición
  utils/
    HttpError.js                  # Error con código de estado HTTP
    handleError.js                # Convierte un error en la respuesta JSON
  data/                           # Archivos JSON de la versión anterior (ya no se usan)
.env
.gitignore
package.json
```

- **Routers:** asocian cada método y ruta con un controller.
- **Controllers:** extraen los datos de la petición (`params` y `body`), llaman al service y devuelven la respuesta.
- **Services:** validan los datos y lanzan un `HttpError` con el código correspondiente (400 o 404) cuando algo falla. El service de reservas también comprueba que los servicios reservados existan.
- **Repositories:** hoy solo delegan en el DAO. Son el punto donde se cambiaría el origen de los datos.
- **DAOs:** ejecutan las consultas con los modelos de Mongoose (`find`, `findById`, `create`, `findByIdAndUpdate`, `findByIdAndDelete`).
- **Modelos:** definen los campos, sus tipos y las validaciones, con mensajes de error en español.

## Respuestas

Todas las respuestas son JSON con la forma `{ "status": "success" | "error", ... }`.

- **Éxito:** `status: "success"` y, según el caso, `payload` (los datos) y `message`.
- **Datos incompletos o inválidos:** `400` con `status: "error"` y un `message`. Si fallan varias validaciones del modelo, los mensajes se devuelven juntos separados por coma.
- **Id mal formado** (por ejemplo `/api/services/abc`): `400` con `"Valor invalido en el campo \"_id\""`.
- **Recurso inexistente** (id con formato válido que no existe, o lista vacía en un `GET` general): `404` con `status: "error"` y un `message`.
- **Error interno** (por ejemplo, una falla de conexión con la base): `500` con el mensaje genérico `"Error interno del servidor"`. El detalle del error queda solo en la consola del servidor.

Un `POST` sin body o con un body vacío se trata como datos incompletos (`400`).

Los documentos se devuelven tal como los guarda MongoDB: el identificador es `_id` (un ObjectId en formato texto) y se agregan `createdAt`, `updatedAt` y `__v`.

## Recurso `services`

```json
{
  "_id": "6b09fc9febd47c39fe2a4ff3",
  "name": "Consulta general",
  "precio": 3000,
  "tiempo": 30,
  "descripcion": "Consulta con un profesional odontologo",
  "createdAt": "2026-11-27T21:56:47.174Z",
  "updatedAt": "2026-11-27T21:56:47.174Z",
  "__v": 0
}
```

| Campo         | Tipo   | Reglas                                      |
|---------------|--------|---------------------------------------------|
| `_id`         | ObjectId | Lo genera MongoDB                         |
| `name`        | String | Obligatorio. Se le quitan espacios sobrantes |
| `precio`      | Number | Obligatorio. No puede ser negativo          |
| `tiempo`      | Number | Obligatorio. Mínimo 1                       |
| `descripcion` | String | Obligatorio. Se le quitan espacios sobrantes |

### Endpoints de servicios

| Método   | Ruta                 | Descripción                  |
|----------|----------------------|------------------------------|
| `GET`    | `/api/services`      | Lista todos los servicios    |
| `GET`    | `/api/services/:sid` | Devuelve un servicio por id  |
| `POST`   | `/api/services`      | Crea un servicio             |
| `PUT`    | `/api/services/:sid` | Actualiza un servicio        |
| `DELETE` | `/api/services/:sid` | Elimina un servicio          |

**`GET /api/services`**

Respuesta `200` con la lista en `payload`. Si no hay ningún servicio guardado, responde `404` (`"Servicios no encontrados"`).

**`GET /api/services/:sid`**

Respuesta `200` con el servicio en `payload`, o `404` (`"No se encuentra el servicio."`) si no existe.

**`POST /api/services`**

```json
{
  "name": "Placa Dental",
  "precio": 15000,
  "tiempo": 200,
  "descripcion": "placa de relajacion para bruxismos"
}
```

- `name`, `precio`, `tiempo` y `descripcion` son obligatorios. Si falta alguno, responde `400` (`"Faltan datos, completar"`). Si están pero tienen un tipo o valor inválido, responde `400` con el mensaje del modelo (por ejemplo `"El precio no puede ser negativo"`).
- Respuesta `201` con el servicio creado en `payload`.

**`PUT /api/services/:sid`**

Actualiza solo los campos que se envían en el body y valida los valores nuevos. Respuesta `200` con el servicio actualizado, `400` si algún valor es inválido, o `404` si no existe.

**`DELETE /api/services/:sid`**

Respuesta `200` con el servicio eliminado en `payload`, o `404` si no existe.

## Recurso `bookings`

```json
{
  "_id": "6b09fcaeebd47c39fe2a4ff8",
  "clientName": "Ana",
  "clientEmail": "ana@test.com",
  "date": "2026-12-01T00:00:00.000Z",
  "time": "10:30",
  "status": "available",
  "services": [
    { "service": "6b09fc9febd47c39fe2a4ff3", "quantity": 2 }
  ],
  "createdAt": "2026-11-27T21:57:02.352Z",
  "updatedAt": "2026-11-27T21:57:02.352Z",
  "__v": 0
}
```

| Campo         | Tipo     | Reglas                                                                             |
|---------------|----------|------------------------------------------------------------------------------------|
| `_id`         | ObjectId | Lo genera MongoDB                                                                  |
| `clientName`  | String   | Obligatorio. Se le quitan espacios sobrantes                                       |
| `clientEmail` | String   | Obligatorio. Tiene que tener formato de email. Se guarda en minúsculas             |
| `date`        | Date     | Obligatorio. Se acepta `"2026-12-01"` o una fecha ISO                              |
| `time`        | String   | Obligatorio. Por ejemplo `"10:30"`                                                 |
| `status`      | String   | Opcional. Si no se envía, vale `"available"`                                       |
| `services`    | Lista    | Obligatoria, con al menos un elemento. Cada elemento: `service` y `quantity`       |

Cada elemento de `services` tiene:

- `service`: el `_id` de un servicio que exista en la colección `services`.
- `quantity`: número, mínimo 1.

### Endpoints de reservas

| Método   | Ruta                 | Descripción                  |
|----------|----------------------|------------------------------|
| `GET`    | `/api/bookings`      | Lista todas las reservas     |
| `GET`    | `/api/bookings/:bid` | Devuelve una reserva por id  |
| `POST`   | `/api/bookings`      | Crea una reserva             |
| `PUT`    | `/api/bookings/:bid` | Actualiza una reserva        |
| `DELETE` | `/api/bookings/:bid` | Elimina una reserva          |

**`GET /api/bookings`**

Respuesta `200` con la lista en `payload`. Si no hay ninguna reserva guardada, responde `404` (`"Reservas no encontradas"`).

**`GET /api/bookings/:bid`**

Respuesta `200` con la reserva en `payload`, o `404` (`"Reserva no encontrada"`) si no existe.

**`POST /api/bookings`**

```json
{
  "clientName": "Ana",
  "clientEmail": "ana@test.com",
  "date": "2026-12-01",
  "time": "10:30",
  "services": [
    { "service": "6b09fc9febd47c39fe2a4ff3", "quantity": 2 }
  ]
}
```

- `clientName`, `clientEmail`, `date`, `time` y `services` son obligatorios. `services` tiene que ser una lista con al menos un elemento. Si falta algo, responde `400` (`"Faltan campos obligatorios"`).
- Cada `service` tiene que ser el id de un servicio existente. Si el id está mal formado responde `400` (`El id de servicio "..." no es valido`), y si no existe responde `400` (`El servicio "..." no existe`). Si un elemento no trae `service`, responde `400` (`"Cada servicio de la reserva debe indicar su id"`).
- Los valores inválidos de los demás campos responden `400` con el mensaje del modelo (por ejemplo `"El email no es valido"` o `"La cantidad debe ser al menos 1"`).
- `status` es opcional y por defecto vale `"available"`.
- Respuesta `201` con la reserva creada en `payload`.

**`PUT /api/bookings/:bid`**

Actualiza solo los campos que se envían en el body y valida los valores nuevos. Si el body incluye `services`, se aplican las mismas comprobaciones que en el `POST` (lista no vacía y servicios existentes). El `_id` no se puede modificar aunque venga en el body. Respuesta `200` con la reserva actualizada, `400` si algún valor es inválido, o `404` si no existe.

**`DELETE /api/bookings/:bid`**

Respuesta `200` con la reserva eliminada en `payload`, o `404` si no existe.

## Limitaciones conocidas

- Un `PUT` sobre un servicio que incluya `_id` en el body responde `500`: MongoDB no permite modificar el `_id`. El `_id` no cambia, pero la respuesta no es un error `400`.
- Las reservas guardan solo el id de cada servicio. Si después se borra un servicio, las reservas que lo referencian quedan apuntando a un servicio inexistente: el `DELETE` de servicios no lo comprueba.
- `status` acepta cualquier texto: no hay una lista cerrada de estados.
- Las listas (`GET /api/services` y `GET /api/bookings`) devuelven todos los documentos, sin paginación ni filtros.
- Un cuerpo con JSON malformado lo rechaza `express.json()` con un `400` en formato HTML, no en el JSON de error de la API.
- Si falla la conexión a MongoDB al arrancar, `connectDB` solo imprime el error y el servidor igual queda escuchando: las peticiones que necesiten la base fallarán.
- La carpeta `src/data/` conserva los JSON de la versión anterior, que ya no se usan.
