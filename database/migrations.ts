import db from '@/database/db';
import { createTables } from '@/database/schema';

export const initDatabase = async () => {
  const database = await db;
  try {
    await database.withTransactionAsync(async () => {
      for (const query of createTables) {
        try {
          await database.execAsync(query);
          console.log('✅ Table created or already exists');
        } catch (error) {
          console.error('❌ Error creating table:', error);
        }
      }
    });
  } catch (error) {
    console.error('❌ Failed to initialize DB transaction:', error);
  }
};
