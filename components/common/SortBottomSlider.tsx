import { View, Text, Pressable } from "react-native";
import { PropsWithChildren } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTheme } from "@/style/ThemeProvider";
import { commonStyles } from "@/style/commonStyles";
import BottomSlider from "./BottomSlider";

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
    <BottomSlider title={"Sort"} onClose={onClose} isVisible={isVisible}>
      {columns.map((item, i) => {
        return (
          <Pressable
            onPress={() => {
              sortBy(item.key);
            }}
            key={i}
          >
            <View style={[commonStyles.modalItemContainer, commonStyles.padS]}>
              <View style={commonStyles.modalIconContainer}>
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
                  commonStyles.modalTextStyle,
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
    </BottomSlider>
  );
}
