# Recars DB

MongoDB seed, backup and restore scripts for Recars.

## Structure

```
packages/db/
├── index.js          # Seed: imports data from FIPE API into MongoDB
├── ref.json          # Collection schema reference
├── services/
│   ├── db.js         # Mongoose connection + schemas
│   └── api.js        # Axios client for FIPE API
└── scripts/
    ├── backup.sh     # Full dump + restore to another host
    ├── export.sh     # Export a single collection to JSON
    ├── exportAll.sh  # Export all collections to JSON
    ├── import.sh     # Import a collection from a JSON file
    └── connect.sh    # Connect to MongoDB via shell
```

## Seed (FIPE API)

The main script (`index.js`) fetches data from the [FIPE API](https://parallelum.com.br/fipe/api/v1) and populates the database:

1. Fetches all car **brands**
2. For each brand, fetches **models**
3. For each model, fetches available **years**
4. For each year, fetches **vehicle data** (FIPE price, fuel type, etc.)
5. Inserts in batches of 100 to manage memory

```bash
npm start  # Run the seed
```

## Collections

| Collection | Fields |
|------------|--------|
| `brands` | id, name |
| `models` | id, brand_id, name |
| `years` | id, model_id, name |
| `cars` | id, brand_id, model_id, year_id, fuel, fipe_id, monthRef, typeVehicle, sigleFuel |

## Backup/Restore Scripts

All scripts are interactive and prompt for credentials:

```bash
# Export all collections to JSON
bash scripts/exportAll.sh

# Export a single collection
bash scripts/export.sh

# Import a collection from a JSON file
bash scripts/import.sh file.json

# Full backup (dump + restore)
bash scripts/backup.sh

# Connect to MongoDB shell
bash scripts/connect.sh
```

## Dependencies

- mongoose 5.4
- axios 0.18
