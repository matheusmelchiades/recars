# Recars

Monorepo do projeto Recars — plataforma de gestão de casos de veículos.

## Estrutura

```
recars/
├── apps/
│   └── app/          # Frontend React (Create React App)
└── packages/
    ├── server/       # API REST Node.js + Express + MongoDB
    └── db/           # Scripts de banco de dados MongoDB
```

## Tecnologias

- **Frontend**: React 16, Material UI, Axios
- **Backend**: Node.js, Express, Passport JWT, Mongoose
- **Banco de dados**: MongoDB 4.4
- **Infra**: Docker, Docker Compose, npm Workspaces

## Pré-requisitos

- [Node.js](https://nodejs.org) >= 14
- [Docker](https://www.docker.com) e Docker Compose

---

## Rodando com Docker

### Modo desenvolvimento (hot reload)

Alterações nos arquivos refletem automaticamente sem precisar rebuildar.

```bash
cp .env.example .env
docker-compose -f docker-compose.dev.yml up --build
```

### Modo produção

Build otimizado servido via nginx.

```bash
cp .env.example .env
docker-compose up --build
```

| Serviço   | URL                      |
|-----------|--------------------------|
| App       | http://localhost:3000    |
| API       | http://localhost:5001    |
| MongoDB   | localhost:27017          |

### Parar os serviços

```bash
docker-compose down                              # produção
docker-compose -f docker-compose.dev.yml down    # dev
```

Para remover também os dados do banco:

```bash
docker-compose down -v
```

---

## Rodando localmente (desenvolvimento)

### 1. Configure as variáveis de ambiente

```bash
cp .env.example .env
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Inicie MongoDB localmente

```bash
docker-compose up mongodb -d
```

### 4. Suba app e server juntos

```bash
npm run dev
```

Ou individualmente:

```bash
npm run dev:app     # React na porta 3000
npm run dev:server  # API na porta 5000
```

---

## Variáveis de Ambiente

| Variável       | Descrição                          | Padrão           |
|----------------|------------------------------------|------------------|
| `AUTH_SECRET`  | Chave secreta JWT                  | `supersecretkey` |
| `DB_NAME`      | Nome do banco MongoDB              | `recars`         |
| `DB_HOST`      | Host do MongoDB                    | `localhost`      |
| `DB_PORT`      | Porta do MongoDB                   | `27017`          |
| `DB_USER`      | Usuário do MongoDB                 | `admin`          |
| `DB_PASSWORD`  | Senha do MongoDB                   | `password`       |
| `API_IMG_URL`  | URL da integração Azure (opcional) | —                |
| `API_IMG_KEY`  | Chave da integração Azure          | —                |

---

## Scripts disponíveis

| Comando              | Descrição                          |
|----------------------|------------------------------------|
| `npm run dev`        | Inicia app e server em paralelo    |
| `npm run dev:app`    | Inicia apenas o frontend           |
| `npm run dev:server` | Inicia apenas a API                |
| `npm run build:app`  | Gera build de produção do frontend |
| `npm run test`       | Roda todos os testes               |
| `npm run test:server`| Roda testes do server              |
