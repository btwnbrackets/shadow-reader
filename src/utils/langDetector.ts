import { commonStyles } from "@/style/commonStyles";
import { StyleProp, TextStyle } from "react-native";

export function getFontFamilyByText(text: string): string {
  if (/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(text)) {
    return "KR";
  } else if (/[ぁ-んァ-ン一-龯]/.test(text)) {
    return "JP";
  } else {
    return "EN";
  }
}

export function fontFamilySelector(text: string): StyleProp<TextStyle> {
  const lang = getFontFamilyByText(text);
  let style = [commonStyles.baseLang as TextStyle];
  if (lang === "KR") {
    style.push(commonStyles.korean);
  }
  if (lang === "JP") {
    style.push(commonStyles.japanese);
  }
  return style as StyleProp<TextStyle>;
}
