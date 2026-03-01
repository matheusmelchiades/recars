# Recars Server

API REST para o sistema de recomendação de carros Recars.

## Tecnologias

- Node.js 14 + Express 4
- MongoDB (Mongoose 5)
- Passport JWT (autenticação)
- bcrypt (hash de senhas)
- consign (auto-loading de módulos)

## Estrutura

```
packages/server/
├── api/
│   ├── auth/           # Estratégia Passport JWT
│   ├── controllers/    # Lógica de negócio
│   ├── models/         # Schemas Mongoose
│   ├── routes/         # Definições de rotas Express
│   └── services/       # Integrações externas
├── config/
│   ├── database.js     # Conexão MongoDB
│   ├── middlewares.js   # CORS, body-parser, morgan
│   └── system.js       # Variáveis de ambiente
├── helper/
│   ├── algorithms.js   # Algoritmo de recomendação (distância euclidiana)
│   ├── encryption.js   # bcrypt wrapper
│   └── time.js         # Utilitários de tempo
├── scripts/
│   ├── seed.js              # Popular banco com dados iniciais
│   └── populate-images.js   # Buscar imagens da Wikipedia para cases
├── __tests__/               # Testes unitários e de integração
├── app.js                   # Express app + consign
└── server.js                # Entry point
```

## Variáveis de Ambiente

| Variável | Default | Descrição |
|----------|---------|-----------|
| `AUTH_SECRET` | `secret` | Secret para assinar JWT |
| `DB_NAME` | `default` | Nome do banco MongoDB |
| `DB_HOST` | `localhost` | Host do MongoDB |
| `DB_PORT` | `27017` | Porta do MongoDB |
| `DB_USER` | - | Usuário MongoDB (opcional) |
| `DB_PASSWORD` | - | Senha MongoDB (opcional) |
| `PORT` | `5000` | Porta do servidor |

## API Endpoints

### Autenticação

| Método | Rota | Auth | Descrição |
|--------|------|------|-----------|
| POST | `/signup` | - | Criar conta (username, password) |
| POST | `/signin` | - | Login, retorna `{username, token}` |
| GET | `/auth` | JWT | Verificar validade do token |

### Marcas e Modelos

| Método | Rota | Auth | Descrição |
|--------|------|------|-----------|
| GET | `/brands?search=` | JWT | Buscar marcas por nome |
| GET | `/models?brand=&model=` | JWT | Buscar modelos por marca/nome |

### Busca (Recomendação)

| Método | Rota | Auth | Descrição |
|--------|------|------|-----------|
| POST | `/search` | JWT | Buscar carros recomendados |
| GET | `/attributes/search` | JWT | Opções do formulário de busca |
| GET | `/attributes/createCase` | JWT | Opções do formulário de caso |

**Body do `/search`:**
```json
{
  "places": "4 lugares",
  "placeUsed": "Cidade",
  "classUse": "Passeio",
  "motor": "1.4 a 1.6",
  "priceMin": 50000,
  "priceMax": 100000
}
```

### Casos

| Método | Rota | Auth | Role | Descrição |
|--------|------|------|------|-----------|
| POST | `/cases` | JWT | Todos | Criar caso novo |
| GET | `/cases` | JWT | ADMIN | Listar casos aprovados |
| DELETE | `/cases` | JWT | ADMIN/HELPER | Deletar casos |
| GET | `/cases/pending` | JWT | ADMIN/HELPER | Listar pendências |
| POST | `/cases/pending` | JWT | ADMIN/HELPER | Aprovar pendências |

**Workflow de status:** `PENDING` → `HOMOLOG` (helper) → `APPROVE` (admin) → `DELETED`

### Outros

| Método | Rota | Auth | Descrição |
|--------|------|------|-----------|
| GET | `/images?search=&branch=` | JWT | Buscar imagens (Wikipedia API) |
| GET | `/fields` | JWT | Menu do usuário por role |
| POST | `/fields` | JWT/ADMIN | Criar permissões de campo |

## Algoritmo de Recomendação

O sistema usa **distância euclidiana ponderada** para recomendar carros:

1. Usuário envia critérios de busca (lugares, tipo de uso, motor, preço)
2. Cada critério é convertido em valor numérico (1-4) via `attributes`
3. Casos aprovados na faixa de preço são filtrados
4. Para cada caso, calcula-se a distância euclidiana ponderada:
   ```
   distância = sqrt(sum(peso_i * |busca_i - caso_i|))
   ```
5. Retorna os 9 casos mais próximos (menor distância)

**Mapeamento de atributos:**

| Busca (search) | Caso (register) | Opções |
|----------------|-----------------|--------|
| `places` | `category` | 2/4/5/7 lugares |
| `placeUsed` | `type` | Cidade, Estrada, Campo, Misto |
| `classUse` | `generalUse` | Passeio, Trabalho leve/pesado, Esporte |
| `motor` | `competence` | Até 1.0, 1.4-1.6, 2.0, Acima de 2.0 |

## Roles

| Role | Permissões | Menu |
|------|-----------|------|
| **ADMIN** | Tudo | Buscar, Novo Caso, Pendências, Aprovados |
| **HELPER** | Criar, aprovar (HOMOLOG), deletar | Buscar, Pendências, Aprovados |
| **USER** | Criar, visualizar aprovados | Buscar, Novo Caso, Aprovados |

## Coleções MongoDB

| Coleção | Campos principais |
|---------|-------------------|
| `users` | username, password (bcrypt), role |
| `brands` | name |
| `models` | brand_id, name, priceAverage |
| `cars` | brand_id, model_id, year, price, fuel |
| `cases` | brand, model, category, type, generalUse, competence, priceAverage, images, status |
| `attributes` | search.field, register.field, options[] |
| `fieldsPermissions` | userRole, fields.menu[] |
| `searchs` | places, placeUsed, classUse, motor, priceMin, priceMax, user |

## Scripts

```bash
npm start          # Iniciar servidor
npm run dev        # Dev com nodemon
npm run seed       # Popular banco com dados iniciais
npm test           # Rodar testes
```

## Docker

**Produção:**
```dockerfile
# Dockerfile - Alpine com build tools para bcrypt nativo
docker build -t recars-server .
```

**Desenvolvimento** (hot reload):
```dockerfile
# Dockerfile.dev - nodemon global + volume mount
docker build -f Dockerfile.dev -t recars-server-dev .
```
