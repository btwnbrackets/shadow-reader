import { Modal, View, Text, Pressable, StyleSheet } from "react-native";
import { PropsWithChildren } from "react";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { radius } from "@/style/theme";
import { useTheme } from "@/style/ThemeProvider";
import { commonStyles } from "@/style/commonStyles";

type Props = PropsWithChildren<{
  isVisible: boolean;
  onClose: () => void;
  columns: { key: string; value: string }[];
  sortedColumn: { column: string; isAsc: boolean };
  sortBy: (column: string) => void;
}>;

export default function SortModal({
  isVisible,
  onClose,
  columns,
  sortedColumn,
  sortBy,
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
              Sort
            </Text>
            <Pressable onPress={onClose}>
              <MaterialIcons name="close" color={theme.text} size={22} />
            </Pressable>
          </View>
          <View style={commonStyles.padM}>
            {columns.map((item, i) => {
              return (
                <Pressable
                  onPress={() => {
                    sortBy(item.key);
                  }}
                  key={i}
                >
                  <View style={[styles.sortItemContainer, commonStyles.padS]}>
                    <View style={styles.sortIconContainer}>
                      {sortedColumn.column == item.key && (
                        <MaterialCommunityIcons
                          name={sortedColumn.isAsc ? "arrow-down" : "arrow-up"}
                          size={20}
                          color={theme.accent}
                        />
                      )}
                    </View>
                    <Text
                      style={[
                        styles.textStyle,
                        commonStyles.textMedium,
                        {
                          color: theme.text,
                        },
                      ]}
                    >
                      {item.value}
                    </Text>
                  </View>
                </Pressable>
              );
            })}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  modalContent: {
    height: "25%",
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
  sortItemContainer: {
    flexDirection: "row",
  },
  sortIconContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  textStyle: {
    justifyContent: "center",
    alignItems: "center",
    flex: 11,
  },
});
