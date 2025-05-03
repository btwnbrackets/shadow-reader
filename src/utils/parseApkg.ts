import { ColMapType, ParsedCSVType } from "@/db/models";
import * as FileSystem from "expo-file-system";
import { openDatabaseAsync } from "expo-sqlite";
import { unzip } from 'react-native-zip-archive';

const UNZIP_LOCATION = `${FileSystem.documentDirectory}apkgUnzip/`;


async function loadApkgAndExtract(apkgPath: string) {
  console.log("unzip with react-native-zip-archive")
  const files = await unzip(apkgPath, UNZIP_LOCATION);

  console.log("unzip filename", files);
  console.log("unzip output location", UNZIP_LOCATION);

  let dbPath = `${UNZIP_LOCATION}collection.anki21`;
  if (await FileSystem.getInfoAsync(dbPath).then((res) => !res.exists)) {
    dbPath = `${UNZIP_LOCATION}collection.anki2`;
  }

  return dbPath
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
  console.log("openDatabase");

  const db = await openDatabaseAsync(dbPath);
  console.log("db", db);

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
  await loadApkgAndExtract(uri);
  const dbPath  = await loadApkgAndExtract(uri);
  const mediaMap = await loadMediaFile();
  const { notes, modelFields } = await openDatabase(dbPath);

  let mid;
  const parsedData = notes.map((note) => {
    const fields = note.flds.split("\x1f");
    mid = note.mid;
    const fieldNames = modelFields[note.mid] || [];
    const data: Record<string, string> = {};
    fieldNames.forEach((name, idx) => {
      data[name] = fields[idx] || "";
    });

    return data;
  });
  return {
    parsedData,
    columns: mid ? modelFields[mid] : [],
    mediaMap,
  };
}

export async function parseAndSaveAudio(
  dir: string | undefined,
  mediaMap: Record<string, string>
) {
  const movedAudioFiles = new Map<string, string>();
  if (dir) {
    const audioTask = Object.entries(mediaMap).map(async ([key, value]) => {
      const newFilePath = `${dir}/${value}`;
      movedAudioFiles.set(value, newFilePath);
      return await FileSystem.copyAsync({
        from: UNZIP_LOCATION + key,
        to: newFilePath,
      });
    });
    await Promise.all(audioTask);
  }

  console.log("movedAudioFiles", movedAudioFiles);

  // delete zip folder
  const info = await FileSystem.getInfoAsync(UNZIP_LOCATION);
  if (info.exists) {
    await FileSystem.deleteAsync(UNZIP_LOCATION);
    console.log("deleted unzip location", UNZIP_LOCATION);
  }

  return movedAudioFiles;
}
