import { unzipSync } from "fflate";
import * as FileSystem from "expo-file-system";

async function loadApkg(path: string): Promise<Uint8Array> {
  const base64 = await FileSystem.readAsStringAsync(path, {
    encoding: FileSystem.EncodingType.Base64,
  });
  const binary = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
  return binary;
}

async function unzipApkg(apkgPath: string) {
  console.log("load anki file");
  const apkgData = await loadApkg(apkgPath);

  console.log("unzip");
  const files = unzipSync(apkgData);
  console.log(files);

  return files;
}

export async function parseApkg(apkgPath: string) {
  const files = unzipApkg(apkgPath);
}
