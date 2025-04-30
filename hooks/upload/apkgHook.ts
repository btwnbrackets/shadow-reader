import { ParsedCSVType } from "@/db/models";
import { parseAndSaveAudio, parseApkg } from "@/src/utils/parseApkg";
import { useCallback, useEffect, useState } from "react";

type Props = {};

export default function apkgHook() {
  const [audioMap, setAudioMap] = useState<Record<string, string>>({});

  const loadApkgFileCallback = async (uri: string) => {
    const { parsedData, columns, mediaMap } = await parseApkg(uri);
    setAudioMap(mediaMap);
    return { parsedData, columns };
  };

  const handleApkgAudioCallback = useCallback(
    async (dir: string | undefined) => {
      return parseAndSaveAudio(dir, audioMap);
    },
    [audioMap]
  );

  return {
    loadApkgFileCallback,
    handleApkgAudioCallback,
  };
}
