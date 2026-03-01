# Recars Server

REST API for the Recars car recommendation system.

## Tech Stack

- Node.js 14 + Express 4
- MongoDB (Mongoose 5)
- Passport JWT (authentication)
- bcrypt (password hashing)
- consign (auto-loading modules)

## Structure

```
packages/server/
├── api/
│   ├── auth/           # Passport JWT strategy
│   ├── controllers/    # Business logic
│   ├── models/         # Mongoose schemas
│   ├── routes/         # Express route definitions
│   └── services/       # External integrations
├── config/
│   ├── database.js     # MongoDB connection
│   ├── middlewares.js   # CORS, body-parser, morgan
│   └── system.js       # Environment variables
├── helper/
│   ├── algorithms.js   # Recommendation algorithm (Euclidean distance)
│   ├── encryption.js   # bcrypt wrapper
│   └── time.js         # Time utilities
├── scripts/
│   ├── seed.js              # Seed database with initial data
│   └── populate-images.js   # Fetch Wikipedia images for cases
├── __tests__/               # Unit and integration tests
├── app.js                   # Express app + consign
└── server.js                # Entry point
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `AUTH_SECRET` | `secret` | JWT signing secret |
| `DB_NAME` | `default` | MongoDB database name |
| `DB_HOST` | `localhost` | MongoDB host |
| `DB_PORT` | `27017` | MongoDB port |
| `DB_USER` | - | MongoDB username (optional) |
| `DB_PASSWORD` | - | MongoDB password (optional) |
| `PORT` | `5000` | Server port |

## API Endpoints

### Authentication

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/signup` | - | Create account (username, password) |
| POST | `/signin` | - | Login, returns `{username, token}` |
| GET | `/auth` | JWT | Verify token validity |

### Brands & Models

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/brands?search=` | JWT | Search brands by name |
| GET | `/models?brand=&model=` | JWT | Search models by brand/name |

### Search (Recommendation)

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/search` | JWT | Find recommended cars |
| GET | `/attributes/search` | JWT | Search form options |
| GET | `/attributes/createCase` | JWT | Case form options |

**`/search` request body:**
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

### Cases

| Method | Route | Auth | Role | Description |
|--------|-------|------|------|-------------|
| POST | `/cases` | JWT | All | Create new case |
| GET | `/cases` | JWT | ADMIN | List approved cases |
| DELETE | `/cases` | JWT | ADMIN/HELPER | Delete cases |
| GET | `/cases/pending` | JWT | ADMIN/HELPER | List pending cases |
| POST | `/cases/pending` | JWT | ADMIN/HELPER | Approve pending cases |

**Status workflow:** `PENDING` → `HOMOLOG` (helper) → `APPROVE` (admin) → `DELETED`

### Other

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/images?search=&branch=` | JWT | Search images (Wikipedia API) |
| GET | `/fields` | JWT | User menu by role |
| POST | `/fields` | JWT/ADMIN | Create field permissions |

## Recommendation Algorithm

The system uses **weighted Euclidean distance** to recommend cars:

1. User submits search criteria (seats, use type, engine, price)
2. Each criterion is converted to a numeric value (1-4) via `attributes`
3. Approved cases within the price range are filtered
4. For each case, the weighted Euclidean distance is calculated:
   ```
   distance = sqrt(sum(weight_i * |search_i - case_i|))
   ```
5. Returns the 9 closest cases (lowest distance)

**Attribute mapping:**

| Search field | Case field | Options |
|-------------|------------|---------|
| `places` | `category` | 2/4/5/7 seats |
| `placeUsed` | `type` | City, Highway, Off-road, Mixed |
| `classUse` | `generalUse` | Leisure, Light work, Heavy work, Sport |
| `motor` | `competence` | Up to 1.0, 1.4-1.6, 2.0, Above 2.0 |

## Roles

| Role | Permissions | Menu |
|------|------------|------|
| **ADMIN** | Everything | Search, New Case, Pending, Approved |
| **HELPER** | Create, approve (HOMOLOG), delete | Search, Pending, Approved |
| **USER** | Create, view approved | Search, New Case, Approved |

## MongoDB Collections

| Collection | Main fields |
|------------|-------------|
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
npm start          # Start server
npm run dev        # Dev with nodemon
npm run seed       # Seed database with initial data
npm test           # Run tests
```

## Docker

**Production:**
```dockerfile
# Dockerfile - Alpine with build tools for native bcrypt
docker build -t recars-server .
```

**Development** (hot reload):
```dockerfile
# Dockerfile.dev - global nodemon + volume mount
docker build -f Dockerfile.dev -t recars-server-dev .
```
