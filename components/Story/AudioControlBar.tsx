import React from "react";
import TapIcon from "@/components/common/TapIcon";
import { StyleSheet, View } from "react-native";
import { useTheme } from "@/style/ThemeProvider";

type Props = {
  playBackward: () => void;
  playForward: () => void;
  playAll: () => void;
  play: () => void;
  toggleRepeat: () => void;
  playBackwardDisabled: boolean;
  playForwardDisabled: boolean;
  isPlaying: boolean;
  isRepeat: boolean;
};

export default function AudioControlBar({
  playBackward,
  playForward,
  playAll,
  play,
  toggleRepeat,
  playBackwardDisabled,
  playForwardDisabled,
  isPlaying,
  isRepeat,
}: Props) {
  const { theme } = useTheme();

  return (
    <View style={[styles.bottomBarContainer, {
      backgroundColor: theme.background,
      borderTopColor: theme.surface
    }]}>
      <TapIcon
        onTap={playBackward}
        disabled={playBackwardDisabled}
        iconName="skip-backward"
      />
      <TapIcon onTap={play} iconName={isPlaying ? "pause" : "play"} />
      <TapIcon
        onTap={playForward}
        disabled={playForwardDisabled}
        iconName={"skip-forward"}
      />
      <TapIcon
        onTap={toggleRepeat}
        iconName={isRepeat ? "repeat" : "repeat-off"}
      />
      <TapIcon onTap={playAll} iconName={"playlist-play"} />
    </View>
  );
}

const styles = StyleSheet.create({
  bottomBarContainer: {
    height: 70,
    padding: 20,
    alignItems: "center",
    borderBottomColor: "transparent",
    borderRightColor: "transparent",
    borderLeftColor: "transparent",
    borderTopWidth: 1,
    flexDirection: "row",
    justifyContent: "space-around",
  },
});
