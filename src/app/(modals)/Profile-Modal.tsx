import BackButton from '@/components/ui/BackButton';
import Header from '@/components/ui/Header';
import ModalWrapper from '@/components/ui/ModalWrapper';
import { colors, radius, spacingX, spacingY } from '@/constants/theme';
import { verticalScale } from "@/utils/styling";
import { Image } from "expo-image";
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { updateProfile } from 'firebase/auth';
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import * as Icons from 'phosphor-react-native';
import React, { useState } from "react";
import { ActivityIndicator, Alert, Platform, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import { auth, storage } from '../../../config/firebase';
import { updateUser } from '../../../services/userService';
import { UserDataType } from '../../../types/types';
import Typo from '../../components/ui/Typo';

const ProfileModal = () => {
  const firebaseuser = auth.currentUser;
  const profileImage = firebaseuser?.photoURL;
  console.log(profileImage);

  const pickImage = async()=>{
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1,1],
      quality: 1,
    });

    if(!result.canceled){
      setUserData({
        ...userData,
        image: result.assets[0].uri,
      });
    }
  }


// -------------------------- setUserData ------------------------------------------

  // Here (UserDataType) is defined inside the type.ts which export name and image 
    // To make more edit field add more items in UserDataType.
  const [userData, setUserData] = useState<UserDataType>({
    name: firebaseuser?.displayName || "",
    image: null,
  })

//---------------------------- Loading State -----------------------------------------

  const [loading, setLoading] = useState(false);
  const router = useRouter();

//------------------------------ProfileImageUpdate function--------------------------------

const onPickImage = async()=>{
  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    allowsEditing: true,
    aspect: [4, 3],
    quality: 0.5,
  })

}

// ------------------------------------- Image Upload function------------------
const uploadProfileImage = async(imageUri: string )=>{
  const response = await fetch(imageUri);
  const blob = await response.blob();

  const filename = `profileImages/${Date.now()}.jpg`;
  const storageRef = ref(storage, filename);
  await uploadBytes(storageRef, blob);
  const downloadURL = await getDownloadURL(storageRef);
  return downloadURL;
}





// ---------------------------------- onSubmit function ----------------------------------

  const onSubmit = async  ()=>{
    const currentUser = auth.currentUser;
    const uid = currentUser?.uid;

    if(!currentUser || !uid){
      console.log("User not loaded yet");
      return;
    }

    let {name, image} = userData;
    const trimmedName = name.trim();
    if(!trimmedName){
      if(Platform.OS == "web"){
        window.alert("Please fill all the details");
      } else {
        Alert.alert("Missing details", "Please fill all the details");
      }
      return;
    }

    try {
      setLoading(true);

      const response = await updateUser(uid, {
        name: trimmedName,
        image, 
      });

      if(!response.success){
        if(Platform.OS == "web"){
          window.alert(response.msg || "Not updated");
        } else {
          Alert.alert("Not updated", response.msg || "Please try again");
        }
        return;
      }
      
      let photoURL = currentUser.photoURL;

      if(image){
        photoURL = await uploadProfileImage(image);
      }

        await updateProfile(currentUser, {
          displayName: trimmedName,
          photoURL,
        });

        await currentUser.reload();

        if(Platform.OS == "web"){
          window.alert("Updated");
        } else {
          Alert.alert("Updated", "Profile updated successfully");
        }
        console.log("Updated");
        router.back();
    } catch (error: any) {
        if(Platform.OS == "web"){
          window.alert(error?.message || "Not updated");
        } else {
          Alert.alert("Not updated", error?.message || "Please try again");
        }
    } finally {
      setLoading(false);
    }
    
  }
    

  // ---------------------------------- FORM -----------------------------------------------------

  return (
    <ModalWrapper>
      <View style={styles.container}>
            <Header 
            title="Update Profile"
            leftIcon={<BackButton />}
            style = {{marginBottom: spacingY._10}}
            />
      




    {/* ---------------------------------------Profile Image------------------------------- */}
      <ScrollView contentContainerStyle={styles.form}>
        <View style={styles.avatarContainer}>
          <Image style={styles.avatar}
          source={
            userData.image
              ? {uri: userData.image} 
              : profileImage
                ? { uri: profileImage}
                : require("../../../assets/images/defaultAvatar.png")
          }
          contentFit="cover"
          transition={100}    
          />

          <TouchableOpacity 
          style={styles.editIcon}
          onPress={pickImage}
          >
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
          <TouchableOpacity onPress={onSubmit} >
            {
              loading ? (
                <ActivityIndicator color="white"/>
              ):(
                <Typo color={colors.white} fontWeight={700}>
                  Update
                </Typo>
              )
            }
          </TouchableOpacity>
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
      backgroundColor: "#6366f1",
      height: verticalScale(55),
      borderRadius: radius._15,
      alignItems: "center",
      justifyContent: "center",
      marginTop: spacingY._10,
    }
  });
