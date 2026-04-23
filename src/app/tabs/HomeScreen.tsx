import React from 'react'
import { Text, TouchableOpacity, View } from "react-native";
import { signOut } from 'firebase/auth';
import { router } from 'expo-router';
import { auth } from "../../../config/firebase";
import { SafeAreaView } from 'react-native-safe-area-context';

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
    <SafeAreaView style={{backgroundColor: 'themeColors.bg'}} >
    <View className='flex-row justify-center'>
        <Text className='font-semibold'>
            Hello, {user?.displayName}
        </Text>
    </View>
    <View>
        <TouchableOpacity className='flex-row'
            onPress={handleLogout}>
            <Text>
                Log-Out
            </Text>
        </TouchableOpacity>
    </View>
    </SafeAreaView>
  )
}

export default HomeScreen
