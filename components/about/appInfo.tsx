import { commonStyles } from "@/style/commonStyles";
import { useTheme } from "@/style/ThemeProvider";
import Constants from "expo-constants";
import { Text, View } from "react-native";
import BasicButton from "../common/BasicButton";

type Props = {
  checkForUpdate: () => void;
};

export default function AppInfo({ checkForUpdate }: Props) {
  const { theme } = useTheme();

  return (
    <View style={[commonStyles.marginLV, commonStyles.gapM]}>
      <View>
        <Text
          style={[
            commonStyles.textMedium,
            { color: theme.text, textAlign: "center", lineHeight: 20 },
          ]}
        >
          <Text style={commonStyles.textBM}>App version: </Text>
          <Text>{Constants.expoConfig?.version}</Text>
        </Text>
      </View>
      <BasicButton title="Check for Updates" onPress={checkForUpdate} />
    </View>
  );
}
