# Recars

Monorepo for the Recars project — a car recommendation platform based on Case-Based Reasoning (CBR).

## Structure

```
recars/
├── apps/
│   └── app/          # React Frontend (Create React App)
└── packages/
    ├── server/       # REST API Node.js + Express + MongoDB
    └── db/           # MongoDB database scripts
```

## Tech Stack

- **Frontend**: React 16, Material UI, Axios
- **Backend**: Node.js, Express, Passport JWT, Mongoose
- **Database**: MongoDB 4.4
- **Infra**: Docker, Docker Compose, npm Workspaces

## Prerequisites

- [Node.js](https://nodejs.org) >= 14
- [Docker](https://www.docker.com) and Docker Compose

---

## Running with Docker

### Development mode (hot reload)

File changes are reflected automatically without rebuilding.

```bash
cp .env.example .env
docker-compose -f docker-compose.dev.yml up --build
```

### Production mode

Optimized build served via nginx.

```bash
cp .env.example .env
docker-compose up --build
```

| Service   | URL                      |
|-----------|--------------------------|
| App       | http://localhost:3000    |
| API       | http://localhost:5001    |
| MongoDB   | localhost:27017          |

### Stop services

```bash
docker-compose down                              # production
docker-compose -f docker-compose.dev.yml down    # dev
```

To also remove database data:

```bash
docker-compose down -v
```

---

## Running locally (development)

### 1. Set up environment variables

```bash
cp .env.example .env
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start MongoDB locally

```bash
docker-compose up mongodb -d
```

### 4. Start app and server together

```bash
npm run dev
```

Or individually:

```bash
npm run dev:app     # React on port 3000
npm run dev:server  # API on port 5000
```

---

## Environment Variables

| Variable       | Description                        | Default          |
|----------------|------------------------------------|------------------|
| `AUTH_SECRET`  | JWT secret key                     | `supersecretkey` |
| `DB_NAME`      | MongoDB database name              | `recars`         |
| `DB_HOST`      | MongoDB host                       | `localhost`      |
| `DB_PORT`      | MongoDB port                       | `27017`          |
| `DB_USER`      | MongoDB user                       | `admin`          |
| `DB_PASSWORD`  | MongoDB password                   | `password`       |
| `API_IMG_URL`  | Azure integration URL (optional)   | —                |
| `API_IMG_KEY`  | Azure integration key              | —                |

---

## Available Scripts

| Command              | Description                        |
|----------------------|------------------------------------|
| `npm run dev`        | Start app and server in parallel   |
| `npm run dev:app`    | Start frontend only                |
| `npm run dev:server` | Start API only                     |
| `npm run build:app`  | Build frontend for production      |
| `npm run test`       | Run all tests                      |
| `npm run test:server`| Run server tests                   |
