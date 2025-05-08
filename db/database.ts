import { openDatabaseAsync, type SQLiteDatabase } from "expo-sqlite";
import * as FileSystem from "expo-file-system";
import { migrations } from "./migrations";
import { MetaData } from "./models";

const DB_NAME = "shadow-reader.db";
const DB_PATH = FileSystem.documentDirectory + DB_NAME;

let db: SQLiteDatabase;

const getDatabaseVersion = async (): Promise<number> => {
  const result = (await db.getFirstSync(
    'SELECT value FROM Version WHERE key = "schema_version";'
  )) as MetaData;
  return result ? parseFloat(result.value) : 1;
};

const setDatabaseVersion = async (version: number) => {
  await db.runAsync(
    'UPDATE Version SET value = ? WHERE key = "schema_version";',
    version
  );
};

const applyMigrations = async () => {
  const currentVersion = await getDatabaseVersion();
  for (const migration of migrations) {
    if (migration.version > currentVersion) {
      console.log("migration", migration.version);
      await migration.script(db);
      await setDatabaseVersion(migration.version);
    }
  }
};

export const setupDatabase = async (): Promise<SQLiteDatabase> => {
  console.log("setupDatabase");
  try {
    db = await openDatabaseAsync(DB_PATH);
    console.log("open db");

    await db.execAsync("PRAGMA foreign_keys = ON;");

    await db.execAsync(
      "CREATE TABLE IF NOT EXISTS Version (key TEXT PRIMARY KEY, value TEXT);"
    );
    await db.execAsync(
      'INSERT OR IGNORE INTO Version (key, value) VALUES ("schema_version", ".9");'
    );

    await db.execAsync(
      `CREATE TABLE IF NOT EXISTS Story (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        creationDate TEXT NOT NULL,
        readDate TEXT
      );`
    );

    await db.execAsync(
      `CREATE TABLE IF NOT EXISTS Sentence (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        content TEXT NOT NULL,
        audioUri TEXT NOT NULL,
        storyId INTEGER NOT NULL,
        translation TEXT,
        isFavorite INTEGER DEFAULT 0,
        FOREIGN KEY(storyId) REFERENCES Story(id) ON DELETE CASCADE
      );`
    );

    await db.execAsync(
      `CREATE TABLE IF NOT EXISTS Tag (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE NOT NULL
      );`
    );

    await db.execAsync(
      `CREATE TABLE IF NOT EXISTS StoryTag (
        storyId INTEGER NOT NULL,
        tagId INTEGER NOT NULL,
        PRIMARY KEY(storyId, tagId),
        FOREIGN KEY(storyId) REFERENCES Story(id) ON DELETE CASCADE,
        FOREIGN KEY(tagId) REFERENCES Tag(id)
      );`
    );

    await db.execAsync(
      `CREATE TABLE IF NOT EXISTS SentenceTag (
        sentenceId INTEGER NOT NULL,
        tagId INTEGER NOT NULL,
        PRIMARY KEY(sentenceId, tagId),
        FOREIGN KEY(sentenceId) REFERENCES Sentence(id) ON DELETE CASCADE,
        FOREIGN KEY(tagId) REFERENCES Tag(id)
      );`
    );
    console.log("created tables");

    await applyMigrations();
    const currentVersion = await getDatabaseVersion();

    console.log("Database setup complete. Version", currentVersion);
  } catch (error) {
    console.log("database setup error", error);
  }
  return db;
};

export { db };
