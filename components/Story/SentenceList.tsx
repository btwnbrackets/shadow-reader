import React from "react";
import { StyleSheet, View } from "react-native";
import { Sentence } from "@/db/models";
import SentenceItem from "./SentenceItem";
import { FlatList } from "react-native-gesture-handler";
import { commonStyles } from "@/style/commonStyles";
import { useTheme } from "@/style/ThemeProvider";

type Props = {
  sentences: Sentence[];
  play: (index: number) => void;
  isPlaying: boolean;
  showTranslation: boolean;
  currentActive: number | null;
  flatListRef: any;
  toggleFavorite: (id: number) => void;
};

export default function SentenceList({
  sentences,
  play,
  isPlaying,
  currentActive,
  flatListRef,
  showTranslation,
  toggleFavorite,
}: Props) {
  const { theme } = useTheme();

  return (
    <View
      style={[
        commonStyles.scrollContainer
      ]}
    >
      <FlatList
        contentContainerStyle={commonStyles.flatList}
        ref={flatListRef}
        data={sentences}
        keyExtractor={(item, index) => `${index}`}
        renderItem={({ item, index }) => (
          <SentenceItem
            toggleFavorite={() => toggleFavorite(item.id)}
            sentence={item}
            play={() => play(index)}
            isPause={index === currentActive && isPlaying}
            isActive={index === currentActive}
            showTranslation={showTranslation}
          />
        )}
      />
    </View>
  );
}
