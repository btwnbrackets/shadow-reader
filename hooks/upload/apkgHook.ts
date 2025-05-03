import { ParsedCSVType } from "@/db/models";
import { parseAndSaveAudio, parseApkg } from "@/src/utils/parseApkg";
import { useCallback, useEffect, useState } from "react";

type Props = {};

export default function apkgHook() {
  const [audioMap, setAudioMap] = useState<Record<string, string>>({});
  const [targetFolder, setTargetFolder] = useState<string>("");

  const loadApkgFileCallback = async (uri: string) => {
    const { EXTRACT_FOLDER, parsedData, columns, mediaMap } = await parseApkg(
      uri
    );
    setAudioMap(mediaMap);
    setTargetFolder(EXTRACT_FOLDER);
    return { parsedData, columns };
  };

  const handleApkgAudioCallback = useCallback(
    async (dir: string | undefined) => {
      return parseAndSaveAudio(targetFolder, dir, audioMap);
    },
    [audioMap, targetFolder]
  );

  return {
    loadApkgFileCallback,
    handleApkgAudioCallback,
  };
}
