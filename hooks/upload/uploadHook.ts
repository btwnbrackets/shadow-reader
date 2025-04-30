import { useState } from "react";
import * as DocumentPicker from "expo-document-picker";
import { getParsedCell } from "@/src/utils/parseCSV";
import * as FileSystem from "expo-file-system";
import { Alert } from "react-native";
import { addSentence, addStory } from "@/db/queries";
import { useRouter } from "expo-router";
import { ALLOWED_EXT } from "@/style/constants";
import { ColExampleType, ColMapType, ParsedCSVType } from "@/db/models";

export default function uploadHook() {
  const [textFile, setTextFile] =
    useState<DocumentPicker.DocumentPickerResult | null>(null);
  const router = useRouter();
  const [extension, setExtension] = useState<string | undefined>();
  const [textData, setTextData] = useState<ParsedCSVType[] | undefined>();
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [colMap, setColMap] = useState<ColMapType>();
  const [colExample, setColExample] = useState<ColExampleType>();
  const [filename, setFilename] = useState<string>("");

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
    csvCallback: (
      uri: string
    ) => Promise<{ parsedData: ParsedCSVType[]; columns: string[] }>,
    apkgCallback: (
      uri: string
    ) => Promise<{ parsedData: ParsedCSVType[]; columns: string[] }>
  ) => {
    setTextData(undefined);
    selectColumns([], []);
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*",
        copyToCacheDirectory: true,
      });

      if (result.canceled) return;

      setTextFile(result);
      let ext = getFileExtension(result?.assets?.[0]?.name);
      setExtension(ext);
      setFilename(result.assets[0].name.replace("." + (ext || ""), ""));
      console.log("ext", ext, result?.assets?.[0]?.name);

      const callback = ext === "apkg" ? apkgCallback : csvCallback;
      if (proceed(ext)) {
        let uri = result?.assets?.[0]?.uri;

        if (uri) {
          setIsLoading(true);
          const { parsedData, columns } = await callback(uri);
          setTextData(parsedData);
          selectColumns(columns, parsedData);
        }
      }
    } catch (error) {
      Alert.alert("Error", "Failed to pick a text file.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleProceed = async (
    csvCallback: (dir: string | undefined) => Promise<Map<string, string>>,
    apkgCallback: (dir: string | undefined) => Promise<Map<string, string>>
  ) => {
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
      const movedAudioFiles =
        extension === "apkg"
          ? await apkgCallback(audioDir)
          : await csvCallback(audioDir);

      const dbStoryId = await addStory(
        filename,
        storyCreationDate
      );
      textData.forEach(async (row) => {
        let sentence = getParsedCell(row, colExample.columns, colMap.sentence);
        let audio = getParsedCell(row, colExample.columns, colMap.audio);
        if(audio && audio.startsWith("[sound:")) {
          audio = audio.slice(7, -1);
        }

        let meaning = getParsedCell(row, colExample.columns, colMap.meaning);
        if (sentence || audio || meaning) {
          await addSentence(
            sentence || "",
            (audio && movedAudioFiles.get(audio)) || "",
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

  const selectColumns = (cols: string[], data: ParsedCSVType[]) => {
    setColExample({
      columns: cols,
      examples: data.length > 0 ? data[0] : {},
    });
    setColMap({
      sentence: data.length > 0 ? 0 : -1,
      meaning: cols.length > 1 ? 1 : -1,
      audio: cols.length > 2 ? 2 : -1,
    });
  };

  return {
    textFile,
    extension,
    textData,
    setTextData,
    isProcessing,
    isLoading,
    colMap,
    setColMap,
    colExample,
    setColExample,
    pickTextFile,
    proceed,
    handleProceed,
    selectColumns,
    filename,
    setFilename,
  };
}
