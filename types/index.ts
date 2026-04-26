import { TextProps, TextStyle } from "react-native";
import React from "react";

export type TypoProps = {
  size?: number;
  title?: "hey there";
  color?: string;
  fontWeight?: TextStyle["fontWeight"];
  style?: TextStyle;
  children: React.ReactNode;
  textProps?: TextProps;
};