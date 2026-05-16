import BackButton from '@/components/ui/BackButton';
import Header from '@/components/ui/Header';
import ModalWrapper from '@/components/ui/ModalWrapper';
import { colors, radius, spacingX, spacingY } from '@/constants/theme';
import { verticalScale } from "@/utils/styling";
import { Image } from "expo-image";
import * as Icons from 'phosphor-react-native';
import React, { useState } from "react";
import { Button, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import { auth } from '../../../config/firebase';
import { UserDataType } from '../../../types/types';
import Typo from '../../components/ui/Typo';

const ProfileModal = () => {
  const user = auth.currentUser;
  const profileImage = user?.photoURL;
  console.log(profileImage);

  const [userData, setUserData] = useState<UserDataType>({
    name:"",
    image: null,
  })
    

  return (
    <ModalWrapper>
      <View style={styles.container}>
            <Header 
            title="Update Profile"
            leftIcon={<BackButton />}
            style = {{marginBottom: spacingY._10}}
            />
      
      {/* ------------------------------FORM-------------------------------- */}




    {/* ---------------------------------------Profile Image------------------------------- */}
      <ScrollView contentContainerStyle={styles.form}>
        <View style={styles.avatarContainer}>
          <Image style={styles.avatar}
          source={
            profileImage
              ? {uri: profileImage}
              : require('../../../assets/images/defaultAvatar.png')
          }
          contentFit="cover"
          transition={100}    
          />

          <TouchableOpacity style={styles.editIcon}>
            <Icons.Pencil
              size={verticalScale(20)}
              color={colors.neutral800} 
            />
          </TouchableOpacity>
        </View>


    {/* -------------------------------------Name Input ----------------------------------------------------- */}
        <View style={styles.inputContainer}>
          <Typo color={colors.neutral200}>Name</Typo>
          <TextInput style={styles.tinput}
          placeholder='Name'
          value={userData.name}
          onChangeText={(value) => setUserData({...userData, name: value})
        }
        />
        </View>
        
        {/* ----------------------------------------------- Footer ---------------------------------------------------------- */}
        <View style={styles.footer}>
          <Button onPress={onSubmit} style={{flex: 1}} >

          </Button>
        </View>




        </ScrollView>


      </View>
    </ModalWrapper>
  );
};

export default ProfileModal;

const styles = StyleSheet.create({
    container:{
        flex: 1,
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
      marginTop: spacingY._20,
    },
    avatar:{
      alignSelf: "center",
      backgroundColor: colors.neutral300,
      height: verticalScale(100),
      width: verticalScale(100),
      borderRadius: 100,
    },
    form:{
      gap: spacingY._30,
      marginTop: spacingY._15,
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
    inputContainer:{
      gap: spacingY._15,
    },
    tinput:{
      height: verticalScale(55),
      backgroundColor: colors.neutral800,
      borderRadius: radius._15,
      paddingHorizontal: spacingX._15,
      fontSize: verticalScale(15),
      color: colors.white,
      borderWidth: 1,
      borderColor: colors.neutral700,

      shadowColor: colors.black,
      shadowOffset: {
        width: 0,
        height: 4,
      }
    },
    footer:{
      alignItems: "center",
      flexDirection: "row",
      justifyContent: "center",
      paddingHorizontal: spacingX._20,
      gap: scale(12),
      paddingTop: spacingY._15,
      borderTopColor: colors.neutral700,
      marginBottom: spacingY._5,
      borderTopWidth: 1,
    }
  });