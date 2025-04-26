import { commonStyles } from "@/style/commonStyles";
import { useTheme } from "@/style/ThemeProvider";
import { Text, Linking } from "react-native";

type Props = {
  string: string;
  link?: string;
};

function HrefWebLink({ string, link }: Props) {
  const { theme } = useTheme();

  return (
    <Text
      style={{ color: link ? theme.accent : theme.text }}
      disabled={link === undefined || link === ""}
      onPress={link ? () => Linking.openURL(link) : undefined}
    >
      {string}
    </Text>
  );
}
export default function Acknowledgement() {
  const { theme } = useTheme();
  return (
    <Text
      style={[
        commonStyles.marginLV,
        commonStyles.padLV,
        commonStyles.textMedium,
        
        { color: theme.text, textAlign: "center", lineHeight: 20, borderBottomColor: theme.lightGray, borderBottomWidth: 1 },
      ]}
    >
      This is an open source project available at
      <HrefWebLink
        string={" GitHub"}
        link="https://github.com/btwnbrackets/shadow-reader"
      />
    </Text>
  );
}
