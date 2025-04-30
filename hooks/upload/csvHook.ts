import { useEffect, useState } from "react";
import * as DocumentPicker from "expo-document-picker";
import { parseCsv } from "@/src/utils/parseCSV";
import * as FileSystem from "expo-file-system";
import { Alert } from "react-native";
import { ParsedCSVType } from "@/db/models";

type Props = {
  setTextData: (data: ParsedCSVType[] | undefined) => void;
  selectColumns: (cols: string[], data: ParsedCSVType[]) => void;
};

export default function csvHook({ selectColumns, setTextData }: Props) {
  // csv/txt
  const [audioFiles, setAudioFiles] =
    useState<DocumentPicker.DocumentPickerResult | null>(null);
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

  const loadTextFileCallback = async (uri: string) => {
    const csvString = await FileSystem.readAsStringAsync(uri);
    setTextContent(csvString);
    return await parseCsv(
      uri,
      fileOptions.isHeader,
      fileOptions.colSplit,
      fileOptions.comment
    );
  };

  const handleTextAudioCallback = async (dir: string | undefined) => {
    const movedAudioFiles = new Map<string, string>();
    if (dir) {
      audioFiles?.assets?.forEach(async (file) => {
        const newFilePath = `${dir}/${file.name}`;
        await FileSystem.copyAsync({ from: file.uri, to: newFilePath });
        movedAudioFiles.set(file.name, newFilePath);
      });
    }
    console.log(movedAudioFiles);
    return movedAudioFiles;
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

  useEffect(() => {
    const updateParsing = async () => {
      if (textContent) {
        let data = await parseCsv(
          textContent,
          fileOptions.isHeader,
          fileOptions.colSplit,
          fileOptions.comment
        );
        setTextData(data.parsedData);
        selectColumns(data.columns, data.parsedData);
      }
    };

    updateParsing();
  }, [fileOptions, textContent]);

  return {
    fileOptions,
    audioFiles,
    setFileOptions,
    loadTextFileCallback,
    handleTextAudioCallback,
    pickAudioFiles,
  };
}
