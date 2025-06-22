
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './configs/schema.js',
  dialect: 'postgresql',
  dbCredentials: {
    url:'postgresql://neondb_owner:npg_v0dsgieuKB8r@ep-sparkling-forest-a8ugoqb5-pooler.eastus2.azure.neon.tech/neondb?sslmode=require',
  },
});
