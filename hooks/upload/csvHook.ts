import { useEffect, useState } from "react";
import * as DocumentPicker from "expo-document-picker";
import { parseCsv, ParsedCSVType } from "@/src/utils/parseCSV";
import * as FileSystem from "expo-file-system";
import { Alert } from "react-native";
import { ColExampleType, ColMapType } from "./uploadHook";

type Props = {
  setAudioFiles: (files: DocumentPicker.DocumentPickerResult | null) => void;
  setTextData: (data: ParsedCSVType[] | undefined) => void;
  setColExample: (data: ColExampleType) => void;
  setColMap: (data: ColMapType) => void;
};

export default function csvHook({
  setAudioFiles,
  setColMap,
  setColExample,
  setTextData,
}: Props) {
  // csv/txt
  const [textContent, setTextContent] = useState<string | undefined>();
  const [fileOptions, setFileOptions] = useState<{
    colSplit: string;
    isHeader: boolean;
    comment: string;
  }>({
    colSplit: ";",
    isHeader: true,
    comment: "#",
  });

  const loadTextFileCallback = (uri: string | undefined) => {
    if (uri) {
      FileSystem.readAsStringAsync(uri).then((val) => setTextContent(val));
    } else {
      setTextContent(undefined);
    }
  };

  const pickAudioFiles = async () => {
    console.log("picking audio files open");
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "audio/*",
        multiple: true,
        copyToCacheDirectory: true,
      });

      if (result.canceled) return;
      setAudioFiles(result);
    } catch (error) {
      Alert.alert("Error", "Failed to pick audio files.");
    }
  };

  const getColumns = (data: any[]): string[] => {
    if (data.length === 0) return [];
    return Object.keys(data[0]);
  };

  useEffect(() => {
    if (textContent) {
      let data = parseCsv(
        textContent,
        fileOptions.isHeader,
        fileOptions.colSplit,
        fileOptions.comment
      );
      setTextData(data);

      let cols = getColumns(data);
      if (cols.length > 0 && data.length > 1) {
        setColExample({
          columns: cols,
          examples: data[1],
        });
        setColMap({
          sentence: 0,
          meaning: cols.length > 1 ? 1 : -1,
          audio: cols.length > 2 ? 2 : -1,
        });
      }
    }
  }, [fileOptions, textContent]);

  return {
    fileOptions,
    setFileOptions,
    loadTextFileCallback,
    pickAudioFiles,
  };
}
