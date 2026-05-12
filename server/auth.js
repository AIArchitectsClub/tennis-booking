import { betterAuth } from "better-auth";
import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

export const auth = betterAuth({
  database: new pg.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  }),
  emailAndPassword: { enabled: true },
  trustedOrigins: [
    "http://localhost:5173",
    "https://tennis-booking-ocbx.onrender.com",
  ],
});
