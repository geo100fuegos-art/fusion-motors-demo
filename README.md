# Fusión Motors 503 — Demo NORYNET

Demo conceptual full-stack para captar y precalificar prospectos de compra de motocicletas.

## Incluye
- Landing mobile-first
- Recomendador de moto en 4 pasos
- Resultados demostrativos
- Formulario de lead
- Vista tipo CRM para mostrar el valor al prospecto
- Tracking de visitas y eventos
- Panel privado `/analytics`
- PostgreSQL
- Configuración `render.yaml`

## Desarrollo local
1. Copiar `.env.example` a `.env` y definir una clave local para `ANALYTICS_ADMIN_KEY`.
2. Ejecutar `npm install` en la raíz.
3. Ejecutar `npm run install:all`.
4. Ejecutar `npm run dev`.

PostgreSQL no es necesario para la demo local: si `DATABASE_URL` está ausente o conserva el valor de ejemplo, el servidor usa almacenamiento temporal en memoria. Los eventos, leads y métricas estarán disponibles mientras el servidor local siga encendido. En Render, una `DATABASE_URL` real activa PostgreSQL automáticamente y conserva los datos de forma persistente.

Vite corre normalmente en `http://localhost:5173` y el API en `http://localhost:3000`. Para desarrollo con Vite agregá un proxy si necesitás usar ambos procesos; en Render el frontend y API se sirven desde el mismo origen.

## Render
El archivo `render.yaml` crea:
- 1 Web Service Node
- 1 PostgreSQL
- `ANALYTICS_ADMIN_KEY` e `IP_HASH_SALT` generados por Render

Una vez desplegado, visitá `/analytics` e ingresá el valor de `ANALYTICS_ADMIN_KEY` de Render.

## Tracking
Eventos incluidos:
- `page_view`
- `start_quiz`
- `quiz_answer`
- `complete_quiz`
- `view_results`
- `select_motorcycle`
- `submit_lead`
- `click_whatsapp`

Podés enviar enlaces como `?ref=whatsapp`, `?ref=email`, `?ref=gerencia`, etc.
