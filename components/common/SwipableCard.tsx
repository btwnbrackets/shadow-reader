import React, { PropsWithChildren, useRef } from "react";
import Swipeable, {
  SwipeableMethods,
} from "react-native-gesture-handler/ReanimatedSwipeable";
import Reanimated, {
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import TapIcon from "@/components/common/TapIcon";
import { LinkProps } from "expo-router";
import {
  ViewStyle,
  StyleSheet,
  StyleProp,
  View,
  Pressable,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  LongPressGestureHandler,
  TapGestureHandler,
} from "react-native-gesture-handler";
import { commonStyles } from "@/style/commonStyles";
import { radius } from "@/style/theme";
import { useTheme } from "@/style/ThemeProvider";

const ICON_WIDTH = 80;

type Props = PropsWithChildren<{
  onEdit?: () => void;
  onDelete: (callback: () => void) => void;
  href?: LinkProps["href"];
  enableEdit: boolean;
  onClick?: () => void;
  onLongPress?: () => void;
}>;

type RightActionProps = {
  progress: SharedValue<number>;
  enableEdit: boolean;
  onEdit?: () => void;
  onDelete: () => void;
};

type RightActionIconProps = {
  iconName: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
  onTap?: () => void;
  style?: StyleProp<ViewStyle>;
};

const RightActionIcon = ({ style, onTap, iconName }: RightActionIconProps) => {
  return (
    <TapIcon
      style={style}
      onTap={onTap}
      iconName={iconName}
      size={32}
      color="white"
    />
  );
};

const RenderRightActions = ({
  progress,
  onEdit,
  onDelete,
  enableEdit,
}: RightActionProps) => {
  const styleAnimation = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: progress.value }],
    };
  });
  const { theme } = useTheme();

  return (
    <Reanimated.View style={[styles.rightContainer, styleAnimation]}>
      {enableEdit && (
        <>
          <RightActionIcon
            style={[styles.iconButton, styles.deleteButton, {backgroundColor: theme.red}]}
            onTap={onDelete}
            iconName="delete"
          />
          <RightActionIcon
            style={[styles.iconButton, styles.editButton, {backgroundColor: theme.primary}]}
            onTap={onEdit}
            iconName="pen"
          />
        </>
      )}
    </Reanimated.View>
  );
};

export default function SwipableCard({
  onEdit,
  onDelete,
  onClick,
  onLongPress,
  enableEdit,
  children,
}: Props) {
  const { theme } = useTheme();

  const isSwipeOpen = useSharedValue(false);
  const swipeableRef = useRef<SwipeableMethods>(null);

  const swipableContainer = useAnimatedStyle(() => {
    return {
      alignItems: isSwipeOpen.value ? "flex-end" : "center",
    };
  });

  const itemStyle = useAnimatedStyle(() => {
    return {
      borderRadius: isSwipeOpen.value && enableEdit ? 0 : 8,
    };
  });

  return (
    <View style={[styles.swipeable, swipableContainer]}>
      <Swipeable
        ref={swipeableRef}
        friction={2}
        enableTrackpadTwoFingerGesture
        rightThreshold={1}
        overshootRight={false}
        onSwipeableWillOpen={() => {
          isSwipeOpen.value = true;
        }}
        onSwipeableWillClose={() => {
          isSwipeOpen.value = false;
        }}
        onSwipeableOpen={() => {
          if (!enableEdit) {
            onDelete(() => swipeableRef.current?.close());
          }
        }}
        renderRightActions={(progress, dragX) => {
          return (
            <RenderRightActions
              progress={progress}
              onEdit={onEdit}
              onDelete={() => {
                onDelete(() => swipeableRef.current?.close());
              }}
              enableEdit={enableEdit}
            />
          );
        }}
      >
        <Reanimated.View
          style={[
            styles.item,
            {
              backgroundColor: theme.border,
            },
            itemStyle,
          ]}
        >
          <LongPressGestureHandler onActivated={onLongPress}>
            <TapGestureHandler onActivated={onClick} waitFor={onLongPress}>
              <View>{children}</View>
            </TapGestureHandler>
          </LongPressGestureHandler>
        </Reanimated.View>
      </Swipeable>
    </View>
  );
}

const styles = StyleSheet.create({
  swipeable: {
    ...commonStyles.marginSV,
  },
  rightContainer: {
    justifyContent: "center",
    width: ICON_WIDTH,
  },
  item: {
    ...commonStyles.padM,
  },
  iconButton: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  deleteButton: {
    borderTopRightRadius: radius.small,
  },
  editButton: {
    borderBottomRightRadius: radius.small,
  },
});
