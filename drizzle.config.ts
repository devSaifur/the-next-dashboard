import { env } from '@/lib/env'
import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './src/db/migrations',
  dialect: 'postgresql',
  verbose: true,
  dbCredentials: {
    url: env.POSTGRES_URL,
  },
})
