import React from "react";
import TapIcon from "@/components/common/TapIcon";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Sentence } from "@/db/models";
import {
  LongPressGestureHandler,
  TapGestureHandler,
} from "react-native-gesture-handler";
import { spacing } from "@/style/theme";
import { useTheme } from "@/style/ThemeProvider";
import { commonStyles } from "@/style/commonStyles";
import { fontFamilySelector } from "@/src/utils/langDetector";

type Props = {
  sentence: Sentence;
  play: () => void;
  toggleFavorite: () => void;
  isPause: boolean;
  isActive: boolean;
  showTranslation: boolean;
};

export default function SentenceItem({
  sentence,
  play,
  isPause,
  isActive,
  showTranslation,
  toggleFavorite,
}: Props) {
  const { theme } = useTheme();
  return (
    <LongPressGestureHandler onActivated={toggleFavorite}>
      <TapGestureHandler onActivated={play} waitFor={toggleFavorite}>
        <View>
          <Text style={styles.container}>
            {sentence.audioUri != "" && (
              <TapIcon
                style={styles.playIcon}
                onTap={play}
                iconName={isPause ? "pause-circle" : "play-circle"}
                color={isActive ? theme.accent : theme.text}
              />
            )}
            <TapIcon
              style={styles.playIcon}
              onTap={toggleFavorite}
              iconName={sentence.isFavorite ? "star" : "star-outline"}
              color={isActive ? theme.accent : theme.text}
            />
            <Text
              style={[
                styles.sentenceContainer,
                fontFamilySelector(sentence.content),
                { color: theme.text },
              ]}
            >
              {sentence.content}
            </Text>
          </Text>
          {showTranslation && (
            <Text
              style={[
                fontFamilySelector(sentence.translation),
                { marginStart: 24 + spacing.small, color: theme.primary },
              ]}
            >
              {sentence.translation}
            </Text>
          )}
        </View>
      </TapGestureHandler>
    </LongPressGestureHandler>
  );
}

const styles = StyleSheet.create({
  playIcon: {
    padding: spacing.small,
    paddingStart: 0,
  },
  container: {
    flexWrap: "wrap",
    flexDirection: "row",
  },
  sentenceContainer: {
    flexWrap: "wrap",
    flexDirection: "row",
    flex: 1,
  },
});
