import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();
const { Pool } = pg;
const connectionString = process.env.CONNECTION_STRING;

export const pool = new Pool({ connectionString });
