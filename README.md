## TikTok Analizer v1.0.0

Aplicativo web para el analisis de sentimientos en comentarios de videos de TikTok. Permite crear analisis, visualizar resultados y consultar historicos con un dashboard moderno.

### Caracteristicas principales
- Landing page con presentacion clara del producto
- Autenticacion de usuarios
- Creacion de analisis desde URL de TikTok
- Dashboard con listas, detalles y metricas
- Paleta de colores configurable

### Estructura del repositorio
- `frontend/tiktok-analizer`: Aplicacion web (React + Vite)
- `backend/nodeapi`: API Node para orquestacion y persistencia
- `backend/pythonapi`: Servicio Python para analisis de sentimientos

### Requisitos
- Node.js 18+
- npm 9+
- Python 3.10+

### Instalacion
1. Clona el repositorio
2. Instala dependencias del frontend
   - `cd frontend/tiktok-analizer`
   - `npm install`
3. Instala dependencias del backend Node
   - `cd backend/nodeapi`
   - `npm install`
4. Instala dependencias del backend Python
   - `cd backend/pythonapi`
   - `pip install -r requirements.txt`

### Ejecucion
Frontend:
- `cd frontend/tiktok-analizer`
- `npm run dev`

Backend Node:
- `cd backend/nodeapi`
- `npm run start`

Backend Python:
- `cd backend/pythonapi`
- `python main.py`

### Configuracion
Revisa las variables de entorno necesarias en cada servicio (Firebase, APIs, URLs internas). Ajusta la paleta de colores en `frontend/tiktok-analizer/src/theme/palette.ts`.

### Version
`v1.0.0`
