import { getDateLabel } from "@/src/utils/dates";
import { db } from "./database";
import { GroupedByHistory, Sentence, Story, StoryDetails, Tag } from "./models";

export const addStory = async (
  name: string,
  creationDate: string
): Promise<number> => {
  const result = await db.runAsync(
    "INSERT INTO Story (name, creationDate) VALUES (?, ?)",
    name,
    creationDate
  );
  return result.lastInsertRowId;
};

export const addSentence = async (
  content: string,
  audioUri: string,
  translation: string,
  storyId: number
): Promise<number> => {
  const result = await db.runAsync(
    "INSERT INTO Sentence (content, audioUri, translation, storyId) VALUES (?, ?, ?, ?)",
    content,
    audioUri,
    translation,
    storyId
  );
  return result.lastInsertRowId;
};

export const addSentenceTag = async (
  sentenceId: number,
  tag: string
): Promise<number> => {
  const tagId = await db.runAsync(
    "INSERT OR IGNORE INTO Tag (name) VALUES (?);",
    tag
  );

  const result = await db.runAsync(
    "INSERT OR IGNORE INTO SentenceTag (sentenceId, tagId) VALUES (?, ?);",
    sentenceId,
    tagId.lastInsertRowId
  );
  return result.lastInsertRowId;
};

export const addHistory = async (
  storyId: number,
  modifiedDate: string
): Promise<number> => {
  console.log("save hist");
  const result = await db.runAsync(
    "UPDATE Story SET readDate = ? WHERE id = ?",
    modifiedDate,
    storyId
  );
  return result.lastInsertRowId;
};

export const deleteHistoy = async (storyId: number): Promise<number> => {
  const result = await db.runAsync(
    "UPDATE Story SET readDate = NULL WHERE id = ?",
    storyId
  );
  return result.lastInsertRowId;
};

export const toggleIsFavoriteSentence = async (id: number): Promise<number> => {
  const result = await db.runAsync(
    `
    UPDATE Sentence
    SET isFavorite = CASE
      WHEN isFavorite = 0 THEN 1
      WHEN isFavorite = 1 THEN 0
    END
    WHERE
        id = ? `,
    id
  );
  return result.lastInsertRowId;
};

export const getAllStories = async (
  column: string,
  asc: boolean,
  searchWord: string
): Promise<Story[]> => {
  const allRows = await db.getAllAsync(
    `SELECT * FROM Story 
    ${searchWord != "" ? "WHERE name LIKE '%" + searchWord + "%'" : ""}
    ORDER BY ${column} ${asc ? "ASC" : "DESC"};
    `
  );
  return allRows as Story[];
};

export const getAllHistory = async (
  searchWord: string
): Promise<GroupedByHistory> => {
  const allRows = (await db.getAllAsync(`
    SELECT *
    FROM Story 
    WHERE readDate IS NOT NULL
    ${searchWord != "" ? " AND name LIKE '%" + searchWord + "%'" : ""}
    ORDER BY readDate DESC;
  `)) as Story[];

  return allRows.reduce((groups: Record<string, any[]>, item) => {
    let label = getDateLabel(item.readDate);
    if (!groups[label]) groups[label] = [];
    groups[label].push(item);
    return groups;
  }, {});
};

export const getAllFavoriteSentences = async (
  searchWord: string,
  onTags: Set<number> | undefined
): Promise<{ sentences: Sentence[]; tags: Tag[] }> => {
  let sentencesSql = `
  SELECT DISTINCT s.*
  FROM Sentence s
  LEFT JOIN SentenceTag st ON st.sentenceId = s.id
  LEFT JOIN Tag t ON t.id = st.tagId
  WHERE s.isFavorite = 1
`;
  const params: any[] = [];

  // Add tag filter
  if (onTags) {
    if (onTags.size > 0) {
      const placeholders = [...onTags].map(() => "?").join(", ");
      sentencesSql += ` AND st.tagId IN (${placeholders})`;
      params.push(...onTags);
    } else {
      sentencesSql += ` AND st.tagId IS NULL`;
    }
  }

  // Add searchWord filter
  if (searchWord !== "") {
    sentencesSql += ` AND s.content LIKE ?`;
    params.push(`%${searchWord}%`);
  }
  const sentences = (await db.getAllAsync(sentencesSql, params)) as Sentence[];

  const tags = (await db.getAllAsync(
    `
    SELECT DISTINCT  t.* 
    FROM Tag t
    INNER JOIN SentenceTag st ON st.tagId = t.id
    INNER JOIN Sentence s ON st.sentenceId = s.id 
    WHERE s.isFavorite = 1
  `
  )) as Tag[];
  return { sentences, tags };
};

export const getSortedStories = async (
  sortBy: "name" | "date",
  asc: boolean
): Promise<Story[]> => {
  const orderByClause =
    (sortBy === "name" ? "ORDER BY name" : "ORDER BY creationDate") +
    (asc ? "ASC" : "DESC");
  const allRows = await db.getAllAsync(`SELECT * FROM Story ${orderByClause};`);
  return allRows as Story[];
};

export const getStoryDetails = async (
  storyId: number,
  searchWord: string,
  onTags: Set<number> | undefined
): Promise<StoryDetails> => {
  const story = await db.getFirstAsync("SELECT * FROM Story WHERE id = ?;", [
    storyId,
  ]);

  let sentencesSql = `
  SELECT DISTINCT s.*
  FROM Sentence s
  LEFT JOIN SentenceTag st ON st.sentenceId = s.id
  LEFT JOIN Tag t ON t.id = st.tagId
  WHERE s.storyId = ?
`;
  const params: any[] = [storyId];

  // Add tag filter
  if (onTags) {
    if (onTags.size > 0) {
      const placeholders = [...onTags].map(() => "?").join(", ");
      sentencesSql += ` AND st.tagId IN (${placeholders})`;
      params.push(...onTags);
    } else {
      sentencesSql += ` AND st.tagId IS NULL`;
    }
  }

  // Add searchWord filter
  if (searchWord !== "") {
    sentencesSql += ` AND s.content LIKE ?`;
    params.push(`%${searchWord}%`);
  }

  const sentences = (await db.getAllAsync(sentencesSql, params)) as Sentence[];
  const tags = (await db.getAllAsync(
    `
    SELECT DISTINCT  t.* 
    FROM Tag t
    INNER JOIN Sentence s ON s.storyId = ?
    INNER JOIN SentenceTag st ON st.sentenceId = s.id
  `,
    [storyId]
  )) as Tag[];

  const storyDetails = {
    story,
    sentences,
    tags,
  } as StoryDetails;
  return storyDetails;
};

export const deleteStory = async (storyId: number): Promise<number> => {
  const result = await db.runAsync("DELETE FROM Story WHERE id = ?", storyId);
  return result.lastInsertRowId;
};

export const deleteAllHistory = async (): Promise<number> => {
  const result = await db.runAsync(
    "DELETE FROM Story WHERE readDate IS NOT NULL"
  );
  return result.lastInsertRowId;
};

export const deleteAllStory = async (): Promise<number> => {
  const result = await db.runAsync("DELETE FROM Story");
  return result.lastInsertRowId;
};

export const deleteIsFavoriteSentence = async (id: number): Promise<number> => {
  const result = await db.runAsync(
    `
    UPDATE Sentence
    SET isFavorite = 0
    WHERE id = ? `,
    id
  );
  return result.lastInsertRowId;
};

export const deleteAllFavoriteSentences = async (): Promise<number> => {
  const result = await db.runAsync(
    `
    UPDATE Sentence
    SET isFavorite = 0`
  );
  return result.lastInsertRowId;
};
