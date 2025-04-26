import { commonStyles } from "@/style/commonStyles";
import { PropsWithChildren } from "react";
import { Text } from "react-native";
import ScreenWrapper from "./ScreenWrapper";
import {  useTheme } from "@/style/ThemeProvider";

type Props = PropsWithChildren<{
  message: string;
}>;

export default function EmptyScreenMessage({ message, children }: Props) {
  const { theme } = useTheme();

  return (
    <ScreenWrapper style={[commonStyles.centeredFullWidth]}>
      <Text style={[commonStyles.messageText, { color: theme.text }]}>
        {message}
      </Text>
      {children}
    </ScreenWrapper>
  );
}
