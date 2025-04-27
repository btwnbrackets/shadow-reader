import * as DocumentPicker from "expo-document-picker";
import { parseCsv, ParsedCSVType } from "@/src/utils/parseCSV";
import { ColExampleType, ColMapType } from "./uploadHook";
import { parseApkg } from "@/src/utils/parseApkg";

type Props = {
  setAudioFiles: (files: DocumentPicker.DocumentPickerResult | null) => void;
  setTextData: (data: ParsedCSVType[] | undefined) => void;
  setColExample: (data: ColExampleType) => void;
  setColMap: (data: ColMapType) => void;
};

export default function apkgHook({
  setAudioFiles,
  setColMap,
  setColExample,
  setTextData,
}: Props) {

  const loadApkgFileCallback = (uri: string | undefined) => {
    if (uri) {
      parseApkg(uri);
      // FileSystem.readAsStringAsync(uri).then((val) => setTextContent(val));
    } else {
      // setTlextContent(undefined);
    }
  };



  return {
    loadApkgFileCallback
  };
}
