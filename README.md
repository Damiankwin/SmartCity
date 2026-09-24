# SmartCity · Gestión de Tráfico Autónomo (Proyecto 1)

API REST (Node.js + Express) que controla los semáforos de una ciudad inteligente a partir de la congestión
reportada por sensores IoT. Este repositorio contiene el código **auditado y corregido** más la suite de
pruebas con **Jest** (unitarias, integración y regresión).

## Requisitos
- Node.js 18 o superior
- npm

## Instalación y ejecución
```bash
npm install          # instala express, jest y supertest
npm start            # levanta la API en http://localhost:3000
```

## Comandos de pruebas
| Comando | Qué ejecuta |
|---|---|
| `npm test` | Las 21 pruebas |
| `npm run test:unit` | 10 unitarias |
| `npm run test:integration` | 9 de integración (Top-Down, Bottom-Up, Big Bang) |
| `npm run test:regression` | 2 de regresión |
| `npm run test:coverage` | Todas + reporte de cobertura (carpeta `coverage/`) |

## Endpoints
| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/traffic` | Lista las intersecciones |
| PUT | `/api/traffic/:id` | Actualiza la congestión (`{ "congestion": 80 }`) y recalcula la luz |

Regla del semáforo: `> 100` → **red** · `> 75` → **yellow** · resto → **green**.
Errores de validación o id inexistente → **400** con `{ "error": "..." }`.

## Estructura
```
smartcity-traffic/
├── src/
│   ├── models/trafficModel.js          # Datos en memoria
│   ├── services/trafficService.js      # Reglas de negocio (semáforo)
│   ├── controllers/trafficController.js# Capa HTTP
│   ├── app.js                          # Express + rutas (exporta app)
│   └── server.js                       # Arranque del servidor
├── tests/
│   ├── unit/                           # U1–U10
│   ├── integration/                    # topDown (TD1–3), bottomUp (BU1–3), bigBang (BB1–3)
│   └── regression/                     # R1–R2
├── original/app.original.js            # Código entregado, con errores (evidencia)
└── docs/informe-auditoria.md           # Informe: bugs, plan de pruebas y evidencias
```

## ¿Por qué se separó el `app.js` original en capas?
El original tenía Modelo, Servicio y Controlador en un solo archivo y sin exportarlos, por lo que
`jest.mock()` no podía aislar el modelo (necesario para las pruebas unitarias y Top-Down).
La lógica es la misma; solo se movió a módulos y se agregó `TrafficModel.reset()` para restaurar datos entre pruebas.
