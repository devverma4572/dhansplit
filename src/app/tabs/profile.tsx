import { getProfileImage } from '@/components/ui/imageService';
import Typo from '@/components/ui/Typo';
import { colors, radius, spacingX, spacingY } from '@/constants/theme';
import { Image } from 'expo-image';
import { signOut } from 'firebase/auth';
import * as Icon from "phosphor-react-native";
import React from 'react';
import { Alert, StyleSheet, TouchableOpacity, View } from 'react-native';
import { auth } from "../../../config/firebase";
import { accountOptionType } from '../../../types/types';
import Header from '../../components/ui/Header';
import { verticalScale } from "../../utils/styling";
import ScreenWrapper from '../ScreenWrapper';


const Profile = () => {
    const user = auth.currentUser;
    // const accountOptions
    const accountOptions: accountOptionType[] = [
      {
        title: "Edit Profile",
        icon: 
          <Icon.User
            size={26}
            color={colors.white}
            weight="fill"
            />,
          routeName: "/(modals)/profileModal",
          bgColor: "#6366f1",
      },
      {
        title: "Settings",
        icon: <Icon.GearSix 
        size={26}
        color={colors.white}
        weight="fill"
        />,
        // routeName: "/(modals)/profileModal",
        bgColor: "#6366f1",
      },
      {
        title: "Privacy Policy",
        icon: <Icon.Lock 
        size={26}
        color={colors.white}
        weight="fill"
        />,
        // routeName: "/(modals)/profileModal",
        bgColor: colors.neutral600,
      },
      {
        title: "Logout",
        icon: <Icon.Power
        size={26}
        color={colors.white}
        weight="fill"
        />,
        // routeName: "/(modals)/profileModal",
        bgColor: "#6366f1", 
      },
    ];

    const handleLogout = async ()=>{
      await signOut(auth);
    }

    const showLogoutAlert = ()=>{
      Alert.alert("Confirm", "Are you sure you want to logout?", [
        {
          text: "Cancel",
          onPress: ()=> console.log('cancel logout'),
          style: 'cancel' 
        },
        {
          text: "Logout",
          onPress: ()=> handleLogout(),
          style: 'destructive'  
        },
      ])
    }




  return (
    <ScreenWrapper>
        <View style={styles.container}>
            <Header title="Profile" style={{marginVertical: spacingY._10}}/>
        </View>



        {/* {User Info} */}
        <View style={styles.userInfo}> 

          {/* {Avatar} */}


          <View style={styles.avatarContainer}>
            {/* {userImage} */}
            <Image 
            source={getProfileImage(user?.image)} 
            style={styles.avatar} 
            contentFit= "cover"
            transition={100}
            />
          </View>

          <View style={styles.nameContainer}>

            <Typo size={24} fontWeight={'600'} color={colors.neutral100}>
              {user?.displayName}
            </Typo>
            <Typo size={16} fontWeight={'400'} color={colors.neutral400}>
              {user?.email}
            </Typo>
    
          </View>


{/* ---------------------ACCOUNT OPTIONS------------------------- */}
        <View style= {styles.accountOptions}>
          {
            accountOptions.map((item, index)=>{
              return(
                <View style={styles.listItem}>
                  <TouchableOpacity style={styles.flexRow}>
                    <View style={[styles.listIcons,
                     {
                      backgroundColor: item?.bgColor,
                     },

                    ]}>
                      {item.icon && item.icon}
                    </View>
                  <Typo size={16} style={{flex: 1}} fontWeight={"500"}>{item.title}</Typo>
                  <Icon.CaretRight
                    size={verticalScale(20)}
                    weight="bold"
                    color={colors.white}
                    />
                    </TouchableOpacity>
                </View>
              )             
            })
          }
        </View>
        </View>


    </ScreenWrapper>
  );
};

export default Profile

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
    },
    accountOptions:{
      marginTop: spacingY._10,
      paddingHorizontal: spacingX._10,
    },
    flexRow:{
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      width: "100%",
      paddingVertical: verticalScale(10),
    },
});
