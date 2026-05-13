import BackButton from '@/components/ui/BackButton';
import Header from '@/components/ui/Header';
import ModalWrapper from '@/components/ui/ModalWrapper';
import { colors, radius, spacingX, spacingY } from '@/constants/theme';
import { verticalScale } from "@/utils/styling";
import React from "react";
import { StyleSheet, View } from "react-native";

const ProfileModal = () => {
  return (
    <ModalWrapper>
      <View style={styles.container}>
            <Header 
            title="Update Profile"
            leftIcon={<BackButton />}
            style = {{marginBottom: spacingY._10}}
            />
      </View>
    </ModalWrapper>
  );
};

export default ProfileModal;

const styles = StyleSheet.create({
    container:{
        flex: 0,
        paddingHorizontal: spacingX._10,
        
    },
    userInfo:{
      marginTop: verticalScale(10),
      alignItems: "center",
      justifyContent: "center",
      // gap: spacingY._15,
    },
    avatarContainer:{
      position: "relative",
      alignSelf: "center",
      marginTop: verticalScale(80),
    },
    avatar:{
      alignSelf: "center",
      backgroundColor: colors.neutral300,
      height: verticalScale(100),
      width: verticalScale(100),
      borderRadius: 100,
    },
    editIcon:{
      position: "absolute",
      bottom: 5,
      right: 8,
      borderRadius: 50,
      backgroundColor: colors.neutral100,
      shadowColor: colors.black,
      shadowOffset: {width: 0, height: 0},
      shadowOpacity: 0.25,
      shadowRadius: 10,
      elevation: 4,
      padding: 5,
    },
    leftSection:{
      flexDirection: "row",
      alignItems: "center",
      gap: spacingX._15,
    },
    nameContainer:{
      marginTop: spacingY._10,
      gap: verticalScale(4),
      alignItems: "center",
    },
    listIcons:{
      height: verticalScale(44),
      width: verticalScale(44),
      backgroundColor: colors.neutral500,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: radius._15,
      borderCurve: "circular",
    },
    listItem: {
      marginBottom: verticalScale(17),
      paddingVertical: 5,
    },
    accountOptions:{
      marginTop: spacingY._10,
      paddingHorizontal: spacingX._10,
      zIndex:999,
    },
    flexRow:{
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      width: "100%",
      paddingVertical: verticalScale(10),
    },
});