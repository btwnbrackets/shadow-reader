import React, { useEffect, useState } from "react";
import { Text, StyleSheet, Alert, View, ActivityIndicator } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { useRouter } from "expo-router";
import BasicButton from "@/components/common/BasicButton";
import { ScrollView } from "react-native-gesture-handler";
import { commonStyles } from "@/style/commonStyles";
import ScreenWrapper from "@/components/common/ScreenWrapper";
import { useTheme } from "@/style/ThemeProvider";
import { Table } from "@/components/upload/Table";
import * as FileSystem from "expo-file-system";
import { getParsedCell, parseCsv, ParsedCSVType } from "@/src/utils/parseCSV";
import { ThemeType } from "@/style/theme";
import { addSentence, addStory } from "@/db/queries";
import EmptyScreenMessage from "@/components/common/EmptyScreenMessage";

export default function UploadScreen() {
  const { theme } = useTheme();

  const [textFile, setTextFile] =
    useState<DocumentPicker.DocumentPickerResult | null>(null);
  const [audioFiles, setAudioFiles] =
    useState<DocumentPicker.DocumentPickerResult | null>(null);
  const router = useRouter();
  const [extension, setExtension] = useState<string | undefined>();
  const [textContent, setTextContent] = useState<string | undefined>();
  const [textData, setTextData] = useState<ParsedCSVType[] | undefined>();
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const [fileOptions, setFileOptions] = useState<{
    colSplit: string;
    isHeader: boolean;
    comment: string;
  }>({
    colSplit: ";",
    isHeader: true,
    comment: "#",
  });

  const [colMap, setColMap] = useState<{
    sentence: number;
    audio: number;
    meaning: number;
  }>();

  const [colExample, setColExample] = useState<{
    columns: string[];
    examples: ParsedCSVType;
  }>();
  const getFileExtension = (filename: string | undefined) => {
    return filename?.split(".")?.pop()?.toLowerCase();
  };

  const proceed = (ext?: string) => {
    if (ext) {
      return ext == "txt" || ext == "csv";
    }
    return extension === "txt" || extension === "csv";
  };

  const pickTextFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*",
        copyToCacheDirectory: true,
      });

      if (result.canceled) return;

      setTextFile(result);
      let ext = getFileExtension(result?.assets?.[0]?.name);
      setExtension(ext);
      if (proceed(ext)) {
        let uri = result?.assets?.[0]?.uri;
        if (uri) {
          FileSystem.readAsStringAsync(uri).then((val) => setTextContent(val));
        }
      } else {
        setTextContent(undefined);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to pick a text file.");
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

  return isProcessing ? (
    <EmptyScreenMessage message="Processing files...">
      {isProcessing && <ActivityIndicator size="large" />}
    </EmptyScreenMessage>
  ) : (
    <ScreenWrapper style={commonStyles.scrollContainer}>
      <ScrollView
        contentContainerStyle={[commonStyles.flatList, commonStyles.gapL]}
      >
        <View style={style(theme).group}>
          <Text style={[commonStyles.textBM, { color: theme.text }]}>
            Upload Text & Audio Files
          </Text>

          <BasicButton title="Pick Text File" onPress={pickTextFile} />
          {textFile && (
            <Text style={[commonStyles.normalText, { color: theme.text }]}>
              {textFile?.assets?.[0]?.name}
            </Text>
          )}

          <BasicButton title="Pick Audio Files" onPress={pickAudioFiles} />
          {audioFiles && (
            <Text style={[commonStyles.normalText, { color: theme.text }]}>
              {audioFiles?.assets?.length} files selected
            </Text>
          )}
        </View>
        {textFile && (
          <View style={style(theme).group}>
            {proceed() ? (
              <Table
                rowData={[
                  {
                    label: "Split cells by",
                    placeholder: fileOptions.colSplit,
                    setInput: (colSplit: string) => {
                      setFileOptions({ ...fileOptions, colSplit });
                    },
                    dropdown: [
                      { label: "Comma (,)", value: "," },
                      { label: "Tab (\\t)", value: "\t" },
                      { label: "Semicolon (;)", value: ";" },
                      { label: "Pipe (|)", value: "|" },
                    ],
                  },
                  {
                    label: "Is first line the header",
                    placeholder: fileOptions.isHeader,
                    setInput: (isHeader: boolean) => {
                      setFileOptions({ ...fileOptions, isHeader });
                    },
                  },
                  {
                    label: "Ignore lines starting with",
                    placeholder: fileOptions.comment,
                    setInput: (comment: string) => {
                      setFileOptions({ ...fileOptions, comment });
                    },
                  },
                ]}
              />
            ) : (
              <View>
                <Text style={[commonStyles.textBM, { color: theme.text }]}>
                  Unsupported file type
                </Text>
              </View>
            )}
          </View>
        )}

        {proceed() && colExample && colMap && (
          <View style={style(theme).group}>
            {textData && (
              <Text style={[commonStyles.normalText, { color: theme.text }]}>
                {textData.length} Rows.
              </Text>
            )}
            <Table
              rowData={[
                {
                  label: "Sentence Content Column",
                  placeholder: colMap.sentence,
                  setInput: (sentence: number) => {
                    setColMap({ ...colMap, sentence });
                  },
                  dropdown: colExample.columns,
                  message:
                    colMap.sentence >= 0 &&
                    colMap.sentence < colExample.columns.length
                      ? "Example: " +
                        getParsedCell(
                          colExample.examples,
                          colExample.columns,
                          colMap.sentence
                        )
                      : undefined,
                },
                {
                  label: "Translation Column",
                  placeholder: colMap.meaning,
                  setInput: (meaning: number) => {
                    setColMap({ ...colMap, meaning });
                  },
                  dropdown: colExample.columns,
                  message:
                    colMap.meaning >= 0 &&
                    colMap.meaning < colExample.columns.length
                      ? "Example: " +
                        getParsedCell(
                          colExample.examples,
                          colExample.columns,
                          colMap.meaning
                        )
                      : undefined,
                },
                {
                  label: "Audio Column",
                  placeholder: colMap.audio,
                  setInput: (audio: number) => {
                    setColMap({ ...colMap, audio });
                  },
                  dropdown: colExample.columns,
                  message:
                    colMap.audio >= 0 &&
                    colMap.audio < colExample.columns.length
                      ? "Example: " +
                        getParsedCell(
                          colExample.examples,
                          colExample.columns,
                          colMap.audio
                        )
                      : undefined,
                },
              ]}
            />
          </View>
        )}
        <BasicButton
          title="Proceed"
          onPress={handleProceed}
          disabled={!textFile || !proceed()}
        />
      </ScrollView>
    </ScreenWrapper>
  );
}

const style = (theme: ThemeType) =>
  StyleSheet.create({
    group: {
      borderBottomWidth: 1,
      borderBottomColor: theme.lightGray,
      ...commonStyles.gapM,
      ...commonStyles.padMV,
    },
  });
