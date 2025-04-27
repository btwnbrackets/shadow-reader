import * as FileSystem from "expo-file-system";
import { openDatabaseAsync } from "expo-sqlite";
import { unzipSync } from "fflate";

const UNZIP_LOCATION = `${FileSystem.documentDirectory}apkgUnzip/`;

async function loadApkgAsBinary(apkgPath: string): Promise<Uint8Array> {
  const base64 = await FileSystem.readAsStringAsync(apkgPath, {
    encoding: FileSystem.EncodingType.Base64,
  });
  return Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
}

function uint8ArrayToBase64(uint8: Uint8Array): string {
  let binary = "";
  const len = uint8.length;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(uint8[i]);
  }
  return btoa(binary);
}

async function loadApkgAndExtract(apkgPath: string) {
  const binary = await loadApkgAsBinary(apkgPath);

  const files = unzipSync(binary);

  const filenames = Object.keys(files);
  let dbPath = `${UNZIP_LOCATION}collection.anki2`;
  console.log(`${filenames.length} files to write.`);

  const saveTasks = Object.entries(files).map(async ([name, data]) => {
    const destPath = UNZIP_LOCATION + name;
    if (name === "collection.anki21") {
      dbPath += "1";
    }
    const base64 = uint8ArrayToBase64(data);
    await FileSystem.writeAsStringAsync(destPath, base64, {
      encoding: FileSystem.EncodingType.Base64,
    });
  });

  await Promise.all(saveTasks);

  console.log(`${filenames.length} files`);
  return { filenames, dbPath };
}

async function loadMediaFile() {
  let mediaMap: Record<string, string> = {};
  const mediaFilePath = `${UNZIP_LOCATION}media`;
  if (await FileSystem.getInfoAsync(mediaFilePath).then((res) => res.exists)) {
    const mediaContent = await FileSystem.readAsStringAsync(mediaFilePath);
    mediaMap = JSON.parse(mediaContent);
  }
  console.log("media", Object.keys(mediaMap).length);
  return mediaMap;
}

async function openDatabase(dbPath: string) {
  const db = await openDatabaseAsync(dbPath);
  const modelsRows = (await db.getFirstAsync("SELECT models FROM col")) as {
    models: string;
  };

  const models = JSON.parse(modelsRows.models) as { [key: string]: any };

  const modelFields: Record<number, string[]> = {};
  for (const [mid, model] of Object.entries(models)) {
    modelFields[parseInt(mid)] = model["flds"].map((field: any) => field.name);
  }
  console.log("modelFields", modelFields);

  const notes = (await db.getAllAsync(
    `SELECT id, guid, mid, tags, flds FROM notes`
  )) as {
    flds: string;
    id: number;
    guid: string;
    mid: number;
    tags: string;
  }[];

  return {
    notes,
    modelFields,
  };
}

export async function parseApkg(uri: string) {
  await FileSystem.makeDirectoryAsync(UNZIP_LOCATION, { intermediates: true });
  const { filenames, dbPath } = await loadApkgAndExtract(uri);
  const mediaMap = await loadMediaFile();
  const { notes, modelFields } = await openDatabase(dbPath);

  const parsedNotes = notes.map((note) => {
    const fields = note.flds.split("\x1f");
    const fieldNames = modelFields[note.mid] || [];
    const data: Record<string, string> = {};
    fieldNames.forEach((name, idx) => {
      data[name] = fields[idx] || "";
    });

    return data;
  });
  console.log(parsedNotes[0]);
  return {
    parsedNotes,
    modelFields,
  };
}
