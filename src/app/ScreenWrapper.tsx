import { View, StyleSheet } from "react-native";
import React, {ReactNode} from "react";
import { SafeAreaView } from "react-native-safe-area-context";

type Props = {
    children: ReactNode;
};

export default function ScreenWrapper({ children }: Props) {
  return (
    <SafeAreaView style=
        {styles.container}
        edges={["top", "left", "right"]}>
      <View style={styles.inner}>
        {children}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111827",
    
  },
  inner: {
    flex: 1,
    padding: 16,
  },
});