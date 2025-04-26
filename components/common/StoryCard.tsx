import React from "react";
import { LinkProps, useRouter } from "expo-router";
import { Text, StyleSheet, View } from "react-native";
import SwipableCard from "./SwipableCard";
import { commonStyles } from "@/style/commonStyles";
import { useTheme } from "@/style/ThemeProvider";

type Props = {
  title: string;
  date: string;
  onEdit?: () => void;
  onDelete: (callback: () => void) => void;
  href: LinkProps["href"];
  enableEdit: boolean;
  numLines?: number | undefined;
};

export default function StoryCard({
  title,
  date,
  href,
  onEdit = () => {},
  onDelete = () => {},
  enableEdit,
  numLines,
}: Props) {
  const router = useRouter();
  const { theme } = useTheme();

  return (
    <SwipableCard
      onDelete={onDelete}
      onEdit={onEdit}
      href={href}
      enableEdit={enableEdit}
      onClick={() => router.push(href)}
    >
      <View style={commonStyles.gapM}>
        <Text
          numberOfLines={numLines}
          style={[commonStyles.textBL, { color: theme.text }]}
        >
          {title}
        </Text>
        <Text style={[commonStyles.textSmall, { color: theme.gray }]}>{date}</Text>
      </View>
    </SwipableCard>
  );
}
