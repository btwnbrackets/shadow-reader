import { commonStyles } from "@/style/commonStyles";
import { useTheme } from "@/style/ThemeProvider";
import { Switch, Text, View, TextInput, ViewStyle } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useState } from "react";
import { fontSize } from "@/style/theme";

type TextField = {
  label: string;
  placeholder: string;
  setInput: (val: string) => void;
  message?: string | undefined;
};
type SwitchField = {
  label: string;
  placeholder: boolean;
  setInput: (val: boolean) => void;
  message?: string | undefined;
};

type DropDownFieldList = {
  label: string;
  placeholder: number;
  dropdown: string[];
  setInput: (val: number) => void;
  message?: string | undefined;
};

type DropDownFieldObject = {
  label: string;
  placeholder: string;
  dropdown: {
    label: string;
    value: string;
  }[];
  setInput: (val: string) => void;
  message?: string | undefined;
};

export type RowField =
  | TextField
  | SwitchField
  | DropDownFieldObject
  | DropDownFieldList;

export function TableRow(options: RowField) {
  const { theme } = useTheme();
  const viewStyle = (
    typeof options.placeholder === "string" || "dropdown" in options
      ? {}
      : {
          flexDirection: "row",
          alignContent: "center",
          alignItems: "center",
        }
  ) as ViewStyle;
  return (
    <View>
      <View style={viewStyle}>
        <Text style={[commonStyles.normalText, commonStyles.marginSV, { color: theme.text, flex: 1 }]}>
          {options.label}
        </Text>
        {"dropdown" in options ? (
          <View
            style={[
              commonStyles.inputText,
              {
                flex: 1,
                backgroundClip: theme.background,
                borderColor: theme.text,
                borderWidth: 1,
                ...commonStyles.borderRadiusCard,
                overflow: "hidden",
                padding: 0,
              },
            ]}
          >
            <Picker
              dropdownIconColor={theme.text}
              dropdownIconRippleColor={theme.text}
              selectionColor={theme.text}
              selectedValue={options.placeholder}
              onValueChange={(itemValue, itemIndex) => {
                if (typeof options.placeholder === "number") {
                  options.setInput(itemValue as number);
                } else {
                  options.setInput(itemValue as string);
                }
              }}
              style={[
                commonStyles.normalText,
                {
                  color: theme.text,
                },
              ]}
            >
              {typeof options.placeholder === "number" && (
                <Picker.Item label="Nothing selected yet" value={-1} />
              )}
              {options.dropdown.map((delim, idx) => {
                return (
                  <Picker.Item
                    key={idx}
                    label={typeof delim === "string" ? delim : delim.label}
                    value={typeof delim === "string" ? idx : delim.value}
                  />
                );
              })}
            </Picker>
          </View>
        ) : typeof options.placeholder === "string" ? (
          <TextInput
            placeholderTextColor={theme.text + "99"}
            style={[
              commonStyles.inputText,
              {
                flex: 1,
                backgroundClip: theme.background,
                color: theme.text,
                borderColor: theme.text,
                borderWidth: 1,
                ...commonStyles.borderRadiusCard,
              },
            ]}
            multiline={true}
            value={options.placeholder}
            onChangeText={options.setInput}
          />
        ) : (
          <Switch
            trackColor={{ false: theme.lightGray, true: theme.accent }}
            thumbColor={options.placeholder ? theme.accent : theme.lightGray}
            ios_backgroundColor={theme.gray}
            value={options.placeholder}
            onValueChange={options.setInput}
            style={[
              commonStyles.inputText,
              {
                flex: 1,
                backgroundClip: theme.background,
                borderColor: theme.text,
                borderWidth: 1,
                ...commonStyles.borderRadiusCard,
              },
            ]}
          />
        )}
      </View>
      {options.message && (
        <View style={[commonStyles.marginSV, { flex: 1 }]}>
          <Text
            style={[
              commonStyles.normalText,
              { color: theme.lightGray },
            ]}
          >
            {options.message}
          </Text>
        </View>
      )}
    </View>
  );
}
