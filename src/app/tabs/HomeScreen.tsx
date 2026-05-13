import { spacingX, spacingY } from '@/constants/theme';
import { router } from 'expo-router';
import { signOut } from 'firebase/auth';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
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
    <View style={StyleSheet.container}>
        
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

export default HomeScreen;

const styles = StyleSheet.create({
    container:{
        flex: 1,
        gap: spacingY._30,
        paddingHorizontal: spacingX._20,
    }
})