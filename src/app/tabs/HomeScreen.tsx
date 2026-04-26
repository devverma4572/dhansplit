import React from 'react'
import { Text, TouchableOpacity, View } from "react-native";
import { signOut } from 'firebase/auth';
import { router } from 'expo-router';
import { auth } from "../../../config/firebase";
import ScreenWrapper from '../ScreenWrapper';

function HomeScreen() {
    const user = auth.currentUser;
    const themeColors = {
        bg: "#E8D700"
    }
    const handleLogout = async ()=>{
        await signOut(auth);
        router.push("../WelcomeScreen");
    }
  return (
    <ScreenWrapper>
    <View className='flex-row justify-center'>
        <Text className='font-semibold text-white    '>
            Hello, {user?.displayName}
        </Text>
    </View>
    <View>
        <TouchableOpacity className='flex-row'
            onPress={handleLogout}>
            <Text className='text-white'>
                Log-Out
            </Text>
        </TouchableOpacity>
    </View>
    </ScreenWrapper>
  )
}

export default HomeScreen
