FROM node:22-alpine AS web
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM python:3.13-slim AS api
WORKDIR /app
COPY api/pyproject.toml api/uv.lock ./
RUN pip install --no-cache-dir fastapi==0.116.1 uvicorn==0.35.0
COPY api ./api
EXPOSE 8000
CMD ["uvicorn", "api.main:app", "--host", "0.0.0.0", "--port", "8000"]
