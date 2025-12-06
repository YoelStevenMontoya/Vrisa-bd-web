# VRISA – Plataforma de Monitoreo de Calidad del Aire

Proyecto académico (Base de Datos 2025-2) que implementa **VRISA**, una plataforma web para:

- Registrar instituciones y estaciones de monitoreo.
- Registrar mediciones diarias de calidad del aire.
- Buscar y filtrar estaciones.
- Seleccionar un día y visualizar las mediciones correspondientes.

Incluye:

- **Backend** en Django + Django REST Framework + PostgreSQL/PostGIS.
- **Frontend** en React + Bootstrap.
- Despliegue con **Docker** y **Docker Compose**.
- APIs RESTful para comunicación frontend–backend.

---

## Estructura del proyecto

```text
Vrisa BD/
├── backend/             # Proyecto Django (API, modelos, autenticación JWT)
├── frontend/            # Aplicación React (interfaz web)
├── Documentation/       # PDFs: documentación técnica, usuario y pruebas
├── docker-compose.yml   # Orquestación de servicios (db, backend, frontend)
└── venv/                # (opcional, NO incluido en el repo)
