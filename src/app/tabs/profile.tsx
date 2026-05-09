import { getProfileImage } from '@/components/ui/imageService';
import Typo from '@/components/ui/Typo';
import { colors, radius, spacingX, spacingY } from '@/constants/theme';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { signOut } from 'firebase/auth';
import * as Icon from "phosphor-react-native";
import React from 'react';
import { Alert, Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { auth } from "../../../config/firebase";
import { accountOptionType } from '../../../types/types';
import Header from '../../components/ui/Header';
import { verticalScale } from "../../utils/styling";
import ScreenWrapper from '../ScreenWrapper';

const Profile = () => {
    const user = auth.currentUser;
    const profileImage = (user as (typeof user & { image?: unknown }) | null)?.image ?? user?.photoURL;
    
    console.log("user: ", user);

// -------------------------------------------------------------------- PROFILE EDIT BUTTONS ---------------------------------------------------------------------
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
// -------------------------------------------------------------------- PROFILE EDIT BUTTONS  ---------------------------------------------------------------------







// ---------------------------------------------------------------------- FUNCTIONS -----------------------------------------------------------------------------

const handleLogout = async ()=>{
  try{
    await signOut(auth);
    console.log("User logged out");
    router.replace("/WelcomeScreen");
  }
  catch(error){
    console.log("Logout Error: ", error);
  }
};

const showLogoutAlert = ()=>{
  if(Platform.OS == "web"){
    const confirmed = window.confirm(
      "Are you sure you want to logout?"
    );

    if(confirmed){
      void handleLogout();
    }
    return;
  };

  Alert.alert("Confirm", "Are you sure you want to logout?", [
    {
      text: "Cancel",
      style: "cancel",
    },
    {
      text: "Logout",
      onPress: ()=> void handleLogout(),
      style: "destructive",
    },
  ]);
}

const handlePress = async(item: accountOptionType)=>{
  if(item.title == "Logout"){
    showLogoutAlert();
  }
} 

// ---------------------------------------------------------------------- FUNCTIONS -----------------------------------------------------------------------------

  return (
    <ScreenWrapper>
        <View style={styles.container}>
            <Header title="Profile" style={{marginVertical: spacingY._10}}/>
        </View>


{/* --------------------------------------------------------------- USER INFO --------------------------------------------------------------------------- */}
        {/* {User Info} */}
        <View style={styles.userInfo}> 

          {/* {Avatar} */}


          <View style={styles.avatarContainer}>
            {/* {userImage} */}
            <Image 
            source={getProfileImage(profileImage)} 
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
          </View>

{/* --------------------------------------------------------------- USER INFO --------------------------------------------------------------------------- */}







{/* -------------------------------------------------------------ACCOUNT OPTIONS----------------------------------------------------------------- */}
        <View style={{flex: 1}}>
        <View style= {styles.accountOptions}>
          {
            accountOptions.map((item, index)=>{
              return(
                <Animated.View 
                  key={item.title}
                entering={FadeInDown.delay(index * 100)
                  .springify()
                  .damping(14)}
                  style={styles.listItem}>
                  
                <TouchableOpacity 
                  style={styles.flexRow}
                  onPress={()=> {
                    console.log("Pressed: ", item.title);
                      handlePress(item)
                  }}
                  >
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
                </Animated.View>
              )             
            })
          }
        </View>
        </View>

    </ScreenWrapper>
    // {/* -------------------------------------------------------------ACCOUNT OPTIONS----------------------------------------------------------------- */}
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
