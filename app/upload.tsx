import React from "react";
import { Text, StyleSheet, View, ActivityIndicator } from "react-native";
import BasicButton from "@/components/common/BasicButton";
import { ScrollView } from "react-native-gesture-handler";
import { commonStyles } from "@/style/commonStyles";
import ScreenWrapper from "@/components/common/ScreenWrapper";
import { useTheme } from "@/style/ThemeProvider";
import { Table } from "@/components/upload/Table";
import { getParsedCell } from "@/src/utils/parseCSV";
import { ThemeType } from "@/style/theme";
import EmptyScreenMessage from "@/components/common/EmptyScreenMessage";
import uploadHook from "@/hooks/upload/uploadHook";
import csvHook from "@/hooks/upload/csvHook";
import apkgHook from "@/hooks/upload/apkgHook";

export default function UploadScreen() {
  const { theme } = useTheme();

  const {
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
  } = uploadHook();

  const { fileOptions, setFileOptions, loadTextFileCallback, pickAudioFiles } =
    csvHook({
      setAudioFiles,
      setColMap,
      setColExample,
      setTextData,
    });

  const { loadApkgFileCallback } = apkgHook({
    setAudioFiles,
    setColMap,
    setColExample,
    setTextData,
  });
  const pickTextFileWithCallback = () => {
    return pickTextFile(loadTextFileCallback, loadApkgFileCallback);
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
            Upload Data
          </Text>

          <BasicButton
            title="Pick a txt, csv or an anki (apkg) File"
            onPress={pickTextFileWithCallback}
          />
          {textFile && (
            <Text style={[commonStyles.normalText, { color: theme.text }]}>
              {textFile?.assets?.[0]?.name}
            </Text>
          )}

          {(extension == "csv" || extension === "txt") && (
            <>
              <BasicButton title="Pick Audio Files" onPress={pickAudioFiles} />
              {audioFiles && (
                <Text style={[commonStyles.normalText, { color: theme.text }]}>
                  {audioFiles?.assets?.length} files selected
                </Text>
              )}
            </>
          )}
        </View>
        {textFile && (
          <View style={style(theme).group}>
            {extension === "csv" || extension === "txt" ? (
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
            ) : extension === "apkg" ? (
              <View>
                <Text style={[commonStyles.textBM, { color: theme.text }]}>
                  apkg anki file
                </Text>
              </View>
            ) : (
              <View>
                <Text style={[commonStyles.textBM, { color: theme.text }]}>
                  Unsupported file type
                </Text>
              </View>
            )}
          </View>
        )}

        {(extension === "csv" || extension === "txt") &&
          colExample &&
          colMap && (
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
