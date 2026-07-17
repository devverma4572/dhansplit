import React, { ReactNode } from "react";
import { Platform, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Props = {
    children: ReactNode;
};

export default function ScreenWrapper({
  children,
}: Props) {

  if (Platform.OS !== "web") {
    return (
      <SafeAreaView
        style={styles.container}
        edges={["top"]}
      >
        <View style={styles.inner}>
          {children}
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={styles.container}
      edges={["top", "left", "right"]}
    >
      <View style={styles.wrapper}>
        <View style={styles.mobileContainer}>
          <View style={styles.inner}>
            {children}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#111827",
    
  },
  wrapper:{
    flex: 1,
    alignItems: "center",
    backgroundColor: "#111827",
  },
  mobileContainer:{
    flex: 1,
    width: "100%",
    maxWidth: Platform.OS === "web" ? 430 : "100%",
    backgroundColor: "111827",

    ...(Platform.OS === "web"
      ?{
        borderRadius: 20,
        overflow: "hidden",
        // borderWidth: 1,
        // borderColor: "2D3748",
      }
      : {}),
  },

  inner: {
    flex: 1,
    padding: 16,
  },
});