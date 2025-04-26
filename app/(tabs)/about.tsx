import ScreenWrapper from "@/components/common/ScreenWrapper";
import queryUpdateDictionary from "@/hooks/about/queryAbout";
import { commonStyles } from "@/style/commonStyles";
import { ScrollView } from "react-native";

import Acknowledgement from "@/components/about/acknowledgement";
import AppInfo from "@/components/about/appInfo";

export default function AboutScreen() {
  const { checkForUpdate } =
    queryUpdateDictionary();

  return (
    <ScreenWrapper style={commonStyles.centeredFullWidth}>
      <ScrollView>
        <Acknowledgement />
        <AppInfo checkForUpdate={checkForUpdate} />
      </ScrollView>
    </ScreenWrapper>
  );
}
