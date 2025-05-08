import React from "react";
import TapIcon from "@/components/common/TapIcon";
import { Text, View, FlatList } from "react-native";
import { useTheme } from "@/style/ThemeProvider";
import { commonStyles } from "@/style/commonStyles";
import { Tag } from "@/db/models";

type Props = {
  tags: Tag[];
  onTagClick: () => void;
};

export default function TagBar({ tags, onTagClick }: Props) {
  const { theme } = useTheme();

  return (
    <View
      style={[
        {
          borderBottomWidth: 1,
          borderBottomColor: theme.surface,
          flexDirection: "row",
        },
      ]}
    >
      <FlatList
        horizontal={true}
        contentContainerStyle={commonStyles.flatList}
        data={tags}
        keyExtractor={(item, index) => item.name}
        renderItem={({ item, index }) => (
          <View key={item.name}>
            <Text
              style={[
                commonStyles.tags,
                { backgroundColor: theme.blue, color: "white" },
              ]}
            >
              {item.name}
            </Text>
          </View>
        )}
      />
    </View>
  );
}
