# Recars DB

Scripts de seed, backup e restore do banco MongoDB para o Recars.

## Estrutura

```
packages/db/
├── index.js          # Seed: importa dados da API FIPE para o MongoDB
├── ref.json          # Schema de referência das coleções
├── services/
│   ├── db.js         # Conexão Mongoose + schemas
│   └── api.js        # Cliente Axios para API FIPE
└── scripts/
    ├── backup.sh     # Dump completo + restore para outro host
    ├── export.sh     # Exportar uma coleção para JSON
    ├── exportAll.sh  # Exportar todas as coleções para JSON
    ├── import.sh     # Importar coleção de um arquivo JSON
    └── connect.sh    # Conectar ao MongoDB via shell
```

## Seed (API FIPE)

O script principal (`index.js`) busca dados da [API FIPE](https://parallelum.com.br/fipe/api/v1) e popula o banco:

1. Busca todas as **marcas** de carros
2. Para cada marca, busca os **modelos**
3. Para cada modelo, busca os **anos** disponíveis
4. Para cada ano, busca os **dados do veículo** (preço FIPE, combustível, etc.)
5. Insere em blocos de 100 para gerenciar memória

```bash
npm start  # Executa o seed
```

## Coleções

| Coleção | Campos |
|---------|--------|
| `brands` | id, name |
| `models` | id, brand_id, name |
| `years` | id, model_id, name |
| `cars` | id, brand_id, model_id, year_id, fuel, fipe_id, monthRef, typeVehicle, sigleFuel |

## Scripts de Backup/Restore

Todos os scripts são interativos e pedem credenciais:

```bash
# Exportar todas as coleções para JSON
bash scripts/exportAll.sh

# Exportar uma coleção específica
bash scripts/export.sh

# Importar coleção de arquivo JSON
bash scripts/import.sh arquivo.json

# Backup completo (dump + restore)
bash scripts/backup.sh

# Conectar ao MongoDB shell
bash scripts/connect.sh
```

## Dependências

- mongoose 5.4
- axios 0.18
