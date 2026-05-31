import { spacingX, spacingY } from '@/constants/theme';
import { router } from 'expo-router';
import { signOut } from 'firebase/auth';
import { doc, onSnapshot } from "firebase/firestore";
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { auth, firestore } from "../../../config/firebase";
import useAuth from '../../../hooks/useAuth';
import ScreenWrapper from '../ScreenWrapper';


function HomeScreen() {
    const {user, loading} = useAuth();
    const [profileData, setProfileData] = useState<any>(null);
    const themeColors = {
        bg: "#E8D700"
    }
    const handleLogout = async ()=>{
        await signOut(auth);
        router.push("../WelcomeScreen");
    }
    useEffect(()=>{
        console.log("profileData= ", profileData);
        console.log("user = ",user);
        console.log("uid=", user?.uid);
        if(loading) return;
        if(!user?.uid){
            console.log("No User ID");
            return;
        }
        console.log("Listening to: ", user.uid);

        const unsub = onSnapshot(
            doc(firestore, "users", user?.uid),
            (snapshot)=>{
                console.log("Snapshot exists: ", snapshot.exists());
                if(snapshot.exists()){
                    setProfileData(snapshot.data());
                }
            }
        );
        return unsub;
    }, [user]
);

  return (
    <ScreenWrapper>
    <View style={styles.container}>
        
    </View>
    <View>
        <TouchableOpacity className='flex-row'
            onPress={handleLogout}>
            <Text className='text-white'>
                Log-Out
            </Text>
            <Text className='color-white'>
                Hello, 
            </Text>

            <Text className='color-white'>
                {profileData?.name}
            </Text>
            

        </TouchableOpacity>
    </View>
    </ScreenWrapper>
  )
}

export default HomeScreen;

const styles = StyleSheet.create({
    container:{
        flex: 1,
        gap: spacingY._30,
        paddingHorizontal: spacingX._20,
    }
})