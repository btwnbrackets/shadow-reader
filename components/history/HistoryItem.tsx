import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { formatDate } from "@/src/utils/dates";
import StoryCard from "../common/StoryCard";
import { Story } from "@/db/models";
import { commonStyles } from "@/style/commonStyles";
import { useTheme } from "@/style/ThemeProvider";

type Props = {
  date: string;
  stories: Story[];
  onDelete: (storyId: number, callback: () => void) => void;
};

export default function HistoryItem({ date, stories, onDelete }: Props) {
  const { theme } = useTheme();

  return (
    <View>
      <Text style={[styles.groupDate, {color: theme.text}]}>{date}</Text>
      {stories.map((historyStory, i) => {
        return (
          <StoryCard
            key={i}
            onDelete={(callback) => onDelete(historyStory.id, callback)}
            href={{
              pathname: "/story/[id]",
              params: { id: historyStory.id },
            }}
            title={historyStory.name}
            date={`Read at: ${formatDate(historyStory.readDate, "hh:mm a")}`}
            enableEdit={false}
            numLines={1}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  groupDate: {
    ...commonStyles.textBL,
    ...commonStyles.padMV,
  },
});
