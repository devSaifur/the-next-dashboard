import { drizzle } from 'drizzle-orm/node-postgres'
import pg from 'pg'
import * as schema from '@/db/schema'

// const sql = neon(process.env.DATABASE_URL!)
// export const db = drizzle(sql, { schema })

const poll = new pg.Pool({ connectionString: process.env.DATABASE_URL! })

export const db = drizzle(poll, { schema })
