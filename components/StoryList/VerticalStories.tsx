import React from "react";
import { StyleSheet, FlatList, View } from "react-native";
import StoryItem from "./StoryItem";
import { Story } from "@/db/models";
import { commonStyles } from "@/style/commonStyles";

type Props = {
  stories: Story[];
  onEdit: (storyId: number) => void;
  onDelete: (
    storyId: number,
    creationDate: string,
    callback: () => void
  ) => void;
};

export default function VerticalStories({
  stories,
  onEdit = () => {},
  onDelete = () => {},
}: Props) {
  return (
    <FlatList
      contentContainerStyle={commonStyles.flatList}
      data={stories}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <StoryItem story={item} onDelete={onDelete} onEdit={onEdit} />
      )}
    />
  );
}
