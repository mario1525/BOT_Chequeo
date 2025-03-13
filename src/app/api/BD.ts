// lib/db.ts
import { Pool } from 'pg';

const pool = new Pool({
    user: "postgres.kbprmwuieeoywkbocvgn",
    host: "aws-0-us-west-1.pooler.supabase.com",
    database: "postgres",
    password: "ACgjFg2lCpTvBp$mn839",
    port: 6543,
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
});

export async function query(text: string, params?: unknown[]) {
    const client = await pool.connect();
    try {
      const res = await client.query(text, params);
      return res;
    } finally {
      client.release();
    }
}