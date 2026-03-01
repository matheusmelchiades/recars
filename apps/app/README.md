# Recars App

React frontend for the Recars car recommendation system.

## Tech Stack

- React 16.8 (Class Components)
- Material UI 3.9
- React Router DOM 5
- Axios
- react-swipeable-views

## Structure

```
src/
├── App/            # App wrapper with Material UI theme
├── Screens/
│   ├── Login/      # Signin / Signup with tabs
│   └── case/
│       ├── search/      # Search for recommendations
│       ├── createCase/  # Create a new case
│       ├── penging/     # Pending approvals
│       └── approved/    # Approved cases
├── components/     # Menu, CardCar, Autocomplete, Snackbar, Dropdown
├── services/       # Axios client (api.js)
├── helper/         # Auth (localStorage JWT)
├── config/         # Routes and MUI theme
└── assets/         # Logo
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `REACT_APP_API` | `http://localhost:5001` | Backend API URL |

## Routes

| Route | Screen | Description |
|-------|--------|-------------|
| `/login` | Login | Signin / Signup |
| `/` | Search | Search for car recommendations |
| `/case` | CreateCase | Register a new case |
| `/penging` | Penging | Approve pending cases |
| `/cases` | Approved | List approved cases |

## Authentication

1. User logs in via `/signin`
2. JWT is stored in `localStorage` under the key `@RECARS::USER`
3. All requests send the `Authorization: Bearer <token>` header
4. On accessing `/`, the app verifies the token via `GET /auth`
5. Visible menu depends on the user's role (from the `/fields` endpoint)

## Scripts

```bash
npm start     # Dev server (port 3000)
npm run build # Production build
npm test      # Tests with Jest
```

## Docker

**Production** (nginx):
```dockerfile
# Dockerfile - multi-stage build with nginx
docker build -t recars-app .
```

**Development** (hot reload):
```dockerfile
# Dockerfile.dev - CRA dev server with polling for Docker
docker build -f Dockerfile.dev -t recars-app-dev .
```
