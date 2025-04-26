import { commonStyles } from "@/style/commonStyles";
import { useTheme } from "@/style/ThemeProvider";
import React from "react";
import { Text, View, StyleSheet } from "react-native";
import { Pressable } from "react-native-gesture-handler";

type Props = {
  title: string;
  onPress?: () => void;
  disabled?: boolean;
};

export default function BasicButton({
  onPress = () => {},
  title,
  disabled = false,
}: Props) {
  const { theme } = useTheme();

  return (
    <Pressable onPress={onPress} disabled={disabled}>
      <View style={[styles.container, {backgroundColor: disabled? theme.border: theme.accent}]}>
        <Text style={[styles.text, {color: disabled? theme.lightGray: "white"}]}>
          {title}
        </Text>
      </View>
    </Pressable>
  );
}
const styles = StyleSheet.create({
  container: {
    justifyContent: "flex-end",
    alignItems: "center",
    ...commonStyles.borderRadiusCard,
  },
  text: {
    ...commonStyles.messageText,
    color: "white",
    fontWeight: "bold",
  },
});
