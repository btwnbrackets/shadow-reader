import { useEffect, useState } from "react";
import * as DocumentPicker from "expo-document-picker";
import { getParsedCell, parseCsv, ParsedCSVType } from "@/src/utils/parseCSV";
import * as FileSystem from "expo-file-system";
import { Alert } from "react-native";
import { addSentence, addStory } from "@/db/queries";
import { useRouter } from "expo-router";
import { ALLOWED_EXT } from "@/style/constants";

export type ColExampleType = { columns: string[]; examples: ParsedCSVType };
export type ColMapType = {
  sentence: number;
  audio: number;
  meaning: number;
};

export default function uploadHook() {
  const [textFile, setTextFile] =
    useState<DocumentPicker.DocumentPickerResult | null>(null);
  const [audioFiles, setAudioFiles] =
    useState<DocumentPicker.DocumentPickerResult | null>(null);
  const router = useRouter();
  const [extension, setExtension] = useState<string | undefined>();
  const [textData, setTextData] = useState<ParsedCSVType[] | undefined>();
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [colMap, setColMap] = useState<ColMapType>();
  const [colExample, setColExample] = useState<ColExampleType>();

  const getFileExtension = (filename: string | undefined) => {
    return filename?.split(".")?.pop()?.toLowerCase();
  };

  const proceed = (ext?: string) => {
    if (ext) {
      return ALLOWED_EXT.includes(ext);
    }
    return extension && ALLOWED_EXT.includes(extension);
  };

  const pickTextFile = async (
    csvCallback: (uri: string | undefined) => void,
    apkgCallback: (uri: string | undefined) => void
  ) => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*",
        copyToCacheDirectory: true,
      });

      if (result.canceled) return;

      setTextFile(result);
      let ext = getFileExtension(result?.assets?.[0]?.name);
      setExtension(ext);
      const callback = ext === "apkg" ? apkgCallback : csvCallback;
      console.log("ext", ext, result?.assets?.[0]?.name);
      if (proceed(ext)) {
        let uri = result?.assets?.[0]?.uri;
        callback(uri);
      } else {
        callback(undefined);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to pick a text file.");
    }
  };

  const handleProceed = async () => {
    if (
      !textFile ||
      !proceed() ||
      colMap === undefined ||
      colExample === undefined ||
      textData == undefined
    ) {
      Alert.alert(
        "Error",
        "Please upload a text, csv or an anki file (apkg) file."
      );
      return;
    }
    setIsProcessing(true);
    try {
      const storyCreationDate = new Date().toISOString();
      const storyDir = `${FileSystem.documentDirectory}story/${storyCreationDate}`;
      await FileSystem.makeDirectoryAsync(storyDir, { intermediates: true });

      const audioDir = `${storyDir}/audio`;
      await FileSystem.makeDirectoryAsync(audioDir, { intermediates: true });

      const movedAudioFiles = new Map();
      audioFiles?.assets?.forEach(async (file) => {
        const newFilePath = `${audioDir}/${file.name}`;
        await FileSystem.copyAsync({ from: file.uri, to: newFilePath });
        movedAudioFiles.set(file.name, newFilePath);
      });

      const dbStoryId = await addStory(
        textFile?.assets?.[0]?.name || "",
        storyCreationDate
      );
      textData.forEach(async (row) => {
        let sentence = getParsedCell(row, colExample.columns, colMap.sentence);
        let audio = getParsedCell(row, colExample.columns, colMap.audio);
        let meaning = getParsedCell(row, colExample.columns, colMap.meaning);
        if (sentence || audio || meaning) {
          await addSentence(
            sentence || "",
            movedAudioFiles.get(audio) || "",
            meaning || "",
            dbStoryId
          );
        }
      });

      Alert.alert(
        "Success",
        `Processed ${textData.length} sentences & ${movedAudioFiles.size} audio files!`
      );

      router.replace("/");
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to process files.");
      router.push("/upload");
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    textFile,
    audioFiles,
    setAudioFiles,
    extension,
    textData,
    setTextData,
    isProcessing,
    colMap,
    setColMap,
    colExample,
    setColExample,
    pickTextFile,
    proceed,
    handleProceed,
  };
}
