import { DefaultTheme } from "styled-components";

const headerHeight = 70;

export enum ThemeColors {
  COLOR_DEFAULT = "#885F9D",
  COLOR_PASTEL = "#FBE7C6",
  COLOR_VINTAGE = "#415F6B",
}

export const defaultTheme: DefaultTheme = {
  bgColor: "#885F9D",
  boardBgColor: "#E3E3E5",
  cardBgColor: "#FEFEFE",
  cardFormBgColor: "#c4c4c4",
  headerBgColor: "#4e335e",
  boardFormBgColor: "#69487a",
  headerHeight,
  textColorLight: "#e5e5e5",
  textColor: "black",
};

export const pastelTheme: DefaultTheme = {
  bgColor: "#FBE7C6",
  boardBgColor: "#B4F8C8",
  cardBgColor: "#ECFDF1",
  cardFormBgColor: "#d9fae2",
  headerBgColor: "#edabb6",
  boardFormBgColor: "#85D2D0",
  headerHeight,
  textColorLight: "#ECFDF1",
  textColor: "black",
};

export const vintageTheme: DefaultTheme = {
  bgColor: "#415F6B",
  boardBgColor: "#07D2BE",
  cardBgColor: "#B4F8C8",
  cardFormBgColor: "#DCBAA9",
  headerBgColor: "#1B2C4C",
  boardFormBgColor: "#65463E",
  headerHeight,
  textColorLight: "#ECFDF1",
  textColor: "#1B2C4C",
};
