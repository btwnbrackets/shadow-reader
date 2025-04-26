import React, { PropsWithChildren } from "react";
import { StyleProp, View, ViewStyle } from "react-native";
import { useTheme } from "@/style/ThemeProvider";

type Props = PropsWithChildren<{
  style?: StyleProp<ViewStyle>;
}>;

export default function ScreenWrapper({ style, children }: Props) {
  const { theme } = useTheme();

  return (
    <View style={[style, { backgroundColor: theme.background }]}>
      {children}
    </View>
  );
}
