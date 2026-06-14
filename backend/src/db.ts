import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';

export const getDb = async (): Promise<Database> => {
  const db = await open({
    filename: './backend/data/data.db',
    driver: sqlite3.Database,
  });
  return db;
};
