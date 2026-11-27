# WaveAlert

WaveAlert is a planned alert service for cold waves, floods and droughts in Bangladesh. This repository currently contains only the TypeScript project setup.

- `frontend/` — browser code
- `backend/` — server code

## Type-check

From the repository root, with Node.js and npm installed:

```sh
npx --yes --package typescript@5.9.3 tsc --project frontend
npx --yes --package typescript@5.9.3 tsc --project backend
```

Both commands check types without generating build files.
