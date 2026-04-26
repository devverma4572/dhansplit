import { Text, TextProps } from "react-native";

export default function AppText({ style, ...props }: TextProps) {
  return (
    <Text
      {...props}
      style={[
        { color: "#e2e8f0", 
        fontSize: 16,
    }, // 🔥 default dark theme text
        style,
      ]}
    />
  );
}