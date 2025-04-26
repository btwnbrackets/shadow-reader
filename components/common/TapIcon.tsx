import React from "react";
import { StyleProp, View, ViewStyle } from "react-native";
import { TapGestureHandler, State } from "react-native-gesture-handler";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useTheme } from "@/style/ThemeProvider";

type Props = {
  iconName: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
  size?: number;
  color?: string | undefined;
  onTap?: () => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
};

export default function TapIcon({
  onTap = () => {},
  iconName,
  size = 24,
  color,
  disabled = false,
  style = {},
}: Props) {
    const { theme } = useTheme();

  return (
    <TapGestureHandler onActivated={onTap}>
      <View style={style}>
        <MaterialCommunityIcons
          name={iconName}
          size={size}
          color={color? color: theme.text}
          disabled={disabled}
        />
      </View>
    </TapGestureHandler>
  );
}
