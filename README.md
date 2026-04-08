# bun_elysia_backend

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts
```
 ## 🏗️ Architecture: Layered Architecture (N-Tier)
## REST API-এর জন্য Layered Architecture সবচেয়ে ভালো। এটাকে বলে Controller → Service → Repository pattern

```bash
Request → Router → Controller → Service → Repository → Database
Response ← Router ← Controller ← Service ← Repository ← Database
```

```
user-management/
│
├── src/
│   ├── config/
│   │   ├── env.ts              # Environment variables (DATABASE_URL, PORT, etc.)
│   │   └── database.ts         # Neon + Drizzle connection setup
│   │
│   ├── db/
│   │   ├── schema/
│   │   │   └── user.schema.ts  # Drizzle table schema (users table)
│   │   ├── migrations/         # Auto-generated drizzle migration files
│   │   └── index.ts            # Export db instance
│   │
│   ├── modules/
│   │   └── user/
│   │       ├── user.routes.ts      # Elysia route definitions
│   │       ├── user.controller.ts  # Request/Response handle করে
│   │       ├── user.service.ts     # Business logic থাকে
│   │       ├── user.repository.ts  # Database queries থাকে
│   │       └── user.dto.ts         # Input validation (Elysia t schema)
│   │
│   ├── middleware/
│   │   ├── error.middleware.ts  # Global error handler
│   │   └── logger.middleware.ts # Request logger
│   │
│   ├── utils/
│   │   ├── response.ts          # Standard API response format
│   │   └── pagination.ts        # Pagination helper
│   │
│   └── index.ts                 # App entry point (Elysia instance)
│
├── drizzle.config.ts            # Drizzle kit configuration
├── .env                         # DATABASE_URL, PORT
├── .env.example                 # Template for env
├── package.json
├── tsconfig.json
└── README.md
```

## 📁 Folder Explanation

- **config/** → Environment & database configuration  
- **db/** → Database schema, migrations, and connection  
- **modules/** → Feature-based modules (user, auth, etc.)  
- **middleware/** → Global middleware (error, logger)  
- **utils/** → Helper functions (response, pagination)  
- **index.ts** → Main entry point of the application  

## 🔗 Data Flow Example (Create User)

## 🔄 User Creation Flow

1. **POST /api/users**
2. **user.routes.ts** → Route match করে (Elysia)
3. **user.dto.ts** → Request body validate করে
4. **user.controller.ts** → Data extract করে service call করে
5. **user.service.ts** → Business logic (duplicate check, hash password)
6. **user.repository.ts** → Database query execute (Drizzle)
7. **Neon PostgreSQL** → Data store হয়
8. 🔁 Response একই flow দিয়ে back আসে

This project was created using `bun init` in bun v1.3.10. [Bun](https://bun.com) is a fast all-in-one JavaScript runtime.
