# Recars App

Frontend React para o sistema de recomendação de carros Recars.

## Tecnologias

- React 16.8 (Class Components)
- Material UI 3.9
- React Router DOM 5
- Axios
- react-swipeable-views

## Estrutura

```
src/
├── App/            # App wrapper com tema Material UI
├── Screens/
│   ├── Login/      # Signin / Signup com tabs
│   └── case/
│       ├── search/      # Buscar recomendações
│       ├── createCase/  # Criar novo caso
│       ├── penging/     # Pendências de aprovação
│       └── approved/    # Casos aprovados
├── components/     # Menu, CardCar, Autocomplete, Snackbar, Dropdown
├── services/       # Cliente Axios (api.js)
├── helper/         # Auth (localStorage JWT)
├── config/         # Rotas e tema MUI
└── assets/         # Logo
```

## Variáveis de Ambiente

| Variável | Default | Descrição |
|----------|---------|-----------|
| `REACT_APP_API` | `http://localhost:5001` | URL da API backend |

## Rotas

| Rota | Tela | Descrição |
|------|------|-----------|
| `/login` | Login | Signin / Signup |
| `/` | Search | Buscar recomendações de carros |
| `/case` | CreateCase | Cadastrar novo caso |
| `/penging` | Penging | Aprovar casos pendentes |
| `/cases` | Approved | Listar casos aprovados |

## Autenticação

1. Usuário faz login via `/signin`
2. JWT é armazenado em `localStorage` com a chave `@RECARS::USER`
3. Todas as requisições enviam o header `Authorization: Bearer <token>`
4. Ao acessar `/`, o app verifica o token via `GET /auth`
5. Menu visível depende da role do usuário (vem do endpoint `/fields`)

## Scripts

```bash
npm start     # Dev server (porta 3000)
npm run build # Build de produção
npm test      # Testes com Jest
```

## Docker

**Produção** (nginx):
```dockerfile
# Dockerfile - build multi-stage com nginx
docker build -t recars-app .
```

**Desenvolvimento** (hot reload):
```dockerfile
# Dockerfile.dev - CRA dev server com polling para Docker
docker build -f Dockerfile.dev -t recars-app-dev .
```
