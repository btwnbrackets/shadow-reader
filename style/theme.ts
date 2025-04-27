export const colors = {
  "grey-dk-000": "#959396",
  "grey-dk-100": "#5c5962",
  "grey-dk-200": "#44434d",
  "grey-dk-250": "#302d36",
  "grey-dk-300": "#27262b",
  "grey-lt-000": "#f5f6fa",
  "grey-lt-100": "#eeebee",
  "grey-lt-200": "#ecebed",
  "grey-lt-300": "#e6e1e8",
  "purple-000": "#7253ed",
  "purple-100": "#5e41d0",
  "purple-200": "#4e26af",
  "purple-300": "#381885",
  "blue-000": "#2c84fa",
  "blue-100": "#2869e6",
  "blue-200": "#264caf",
  "blue-300": "#183385",
  "green-000": "#41d693",
  "green-100": "#11b584",
  "green-200": "#009c7b",
  "green-300": "#026e57",
  "yellow-000": "#ffeb82",
  "yellow-100": "#fadf50",
  "yellow-200": "#f7d12e",
  "yellow-300": "#e7af06",
  "red-000": "#f77e7e",
  "red-100": "#f96e65",
  "red-200": "#e94c4c",
  "red-300": "#dd2e2e",
};

export const lightTheme = {
  mode: "light",
  background: "#ECEFF4",
  surface: "#E5E9F0",
  text: "#2E3440",
  primary: "#5E81AC",
  secondary: "#88C0D0",
  accent: "#81A1C1",
  border: "#D8DEE9",
  gray: colors["grey-dk-000"],
  lightGray: colors["grey-dk-000"],
  red: colors["red-200"],
  yellow: colors["yellow-200"],
  blue: colors["blue-200"],
  green: colors["green-100"],
  purple: colors["purple-000"],
};

export const darkTheme = {
  mode: "dark",
  background: "#2E3440",
  surface: "#3B4252",
  text: "#ECEFF4",
  primary: "#81A1C1",
  secondary: "#88C0D0",
  accent: "#5E81AC",
  border: "#4C566A",
  gray: colors["grey-dk-300"],
  lightGray: colors["grey-dk-000"],
  red: colors["red-000"],
  yellow: colors["yellow-200"],
  blue: colors["blue-000"],
  green: colors["green-100"],
  purple: colors["purple-000"],

};

export type ThemeType = typeof lightTheme;

export const fonts = {
  japanese: "NotoSerifJP",
  korean: "NotoSerifKR"
};

export const spacing = {
  xsmall: 5,
  small: 8,
  medium: 16,
  large: 24,
  xlarge: 36,
};

export const radius = {
  small: 8,
  medium: 16,
  large: 24,
};
export const fontSize = {
  small: 12,
  medium: 16,
  large: 20,
  xlarge: 24,
};

export const BOX_ALPHA = "55";