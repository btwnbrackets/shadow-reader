import { View, Text, Pressable } from "react-native";
import { PropsWithChildren } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTheme } from "@/style/ThemeProvider";
import { commonStyles } from "@/style/commonStyles";
import { Tag } from "@/db/models";
import BottomSlider from "./BottomSlider";
import { ScrollView } from "react-native-gesture-handler";

type Props = PropsWithChildren<{
  isVisible: boolean;
  onClose: () => void;
  tags: Tag[];
  filterOn?: Set<number>;
  filterBy: (tagId: number) => void;
}>;

export default function FilterModal({
  isVisible,
  onClose,
  tags,
  filterOn,
  filterBy,
}: Props) {
  const { theme } = useTheme();
  console.log(isVisible, tags.length, filterOn?.size);
  return (
    <BottomSlider title={"Filter"} onClose={onClose} isVisible={isVisible}>
      <ScrollView>
        {filterOn !== undefined &&
          tags.map((item, i) => {
            return (
              <Pressable
                onPress={() => {
                  filterBy(item.id);
                }}
                key={i}
              >
                <View
                  style={[commonStyles.modalItemContainer, commonStyles.padS]}
                >
                  <View style={commonStyles.modalIconContainer}>
                    {filterOn.has(item.id) && (
                      <MaterialCommunityIcons
                        name={"check"}
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
                    {item.name}
                  </Text>
                </View>
              </Pressable>
            );
          })}
      </ScrollView>
    </BottomSlider>
  );
}
