import { openDatabaseSync } from 'expo-sqlite';

const db = openDatabaseSync('app.db');

export default db;
