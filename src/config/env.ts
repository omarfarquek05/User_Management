export const env = {
  DATABASE_URL:          process.env.DATABASE_URL!,
  PORT:                  Number(process.env.PORT) || 5000,
  NODE_ENV:              process.env.NODE_ENV || "development",
  ACCESS_TOKEN_SECRET:   process.env.ACCESS_TOKEN_SECRET!,
  REFRESH_TOKEN_SECRET:  process.env.REFRESH_TOKEN_SECRET!,
  ACCESS_TOKEN_EXPIRE:   process.env.ACCESS_TOKEN_EXPIRE  ?? "15m",
  REFRESH_TOKEN_EXPIRE:  process.env.REFRESH_TOKEN_EXPIRE ?? "7d",
};