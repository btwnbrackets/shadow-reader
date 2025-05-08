import { Modal, View, Text, Pressable, StyleSheet } from "react-native";
import { PropsWithChildren } from "react";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { radius } from "@/style/theme";
import { useTheme } from "@/style/ThemeProvider";
import { commonStyles } from "@/style/commonStyles";

type Props = PropsWithChildren<{
  isVisible: boolean;
  onClose: () => void;
  title: string;
}>;

export default function BottomSlider({
  title,
  isVisible,
  onClose,
  children,
}: Props) {
  const { theme } = useTheme();

  return (
    <View>
      <Modal animationType="slide" transparent={true} visible={isVisible}>
        <View
          style={[
            styles.modalContent,
            {
              backgroundColor: theme.surface,
            },
          ]}
        >
          <View
            style={[
              styles.titleContainer,
              commonStyles.padSV,
              commonStyles.padLH,
              {
                backgroundColor: theme.accent,
              },
            ]}
          >
            <Text
              style={[
                commonStyles.textBM,
                {
                  color: theme.text,
                },
              ]}
            >
              {title}
            </Text>
            <Pressable onPress={onClose}>
              <MaterialIcons name="close" color={theme.text} size={22} />
            </Pressable>
          </View>
          <View
            style={[commonStyles.padM, commonStyles.scrollContainer]}
          >
            {children}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  modalContent: {
    height: "30%",
    width: "100%",
    borderTopRightRadius: radius.medium,
    borderTopLeftRadius: radius.medium,
    position: "absolute",
    bottom: 0,
  },
  titleContainer: {
    borderTopRightRadius: radius.medium,
    borderTopLeftRadius: radius.medium,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
