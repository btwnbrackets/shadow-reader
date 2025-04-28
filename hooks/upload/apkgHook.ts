import { ParsedCSVType } from "@/db/models";
import { parseApkg } from "@/src/utils/parseApkg";

type Props = {
};

export default function apkgHook() {
  const loadApkgFileCallback = async (uri: string) => {
    return parseApkg(uri);
  };

  const handleTextFileCallback = async (
    dir: string | undefined
  ) => {
    const movedAudioFiles = new Map<string, string>();

    return movedAudioFiles;
  };

  return {
    loadApkgFileCallback,
    handleTextFileCallback,
  };
}
