import React from 'react'
import ScreenWrapper from '../ScreenWrapper'
import {View, Text} from 'react-native';
import Header from '../../components/ui/Header';
import { StyleSheet } from 'react-native';
import { verticalScale } from "../../utils/styling";
import { colors, radius, spacingX, spacingY } from '@/constants/theme';

const Profile = () => {
  return (
    <ScreenWrapper>
        <View style={styles.container}>
            <Header></Header>
        </View>
    </ScreenWrapper>
  );
};

export default Profile

const styles = StyleSheet.create({
    container:{
        flex: 1,
        paddingHorizontal: spacingX._20,
    },
    userInfo:{
      marginTop: verticalScale(30),
      alignItems: "center",
      gap: spacingY._15,
    },
    avatarContainer:{
      position: "relative",
      alignSelf: "center",
    },
    avatar:{
      alignSelf: "center",
      backgroundColor: colors.neutral300,
      height: verticalScale(135),
      width: verticalScale(135),
      borderRadius: 200,
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
    nameContainer:{
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
    },
    accountOptions:{
      marginTop: spacingY._35,
    },
    flexRow:{
      flexDirection: "row",
      alignItems: "center",
      gap: spacingX._15,
    },
});
