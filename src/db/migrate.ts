import { drizzle } from 'drizzle-orm/neon-http'
import { migrate } from 'drizzle-orm/neon-http/migrator'
import { type NeonQueryFunction, neon } from '@neondatabase/serverless'

import { env } from '@/lib/env'

const sql = neon(env.DATABASE_URL)

const db = drizzle(sql as NeonQueryFunction<boolean, boolean>)

const main = async () => {
  try {
    await migrate(db, {
      migrationsFolder: 'src/db/migrations',
    })

    console.log('Migration successful')
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}

main()
