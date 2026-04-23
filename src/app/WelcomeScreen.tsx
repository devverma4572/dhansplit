import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Alert, View, Text, Image, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import "../global.css";

export default function WelcomeScreen(){
    const themeColors = {
        bg: "#E8D700",
        primary: "#22c55e",
    };
    return(
        <SafeAreaView className="flex-1" style={{backgroundColor: themeColors.bg}}>
            <View className="flex-1 flex justify-around my-4">
            <Text className="text-white font-bold text-4xl text-center  ">
                Let's Get Started
            </Text>

            <View className="flex-row justify-center">
                <Image source={require("../../assets/images/welcome-image.png")}
                    style={{width: 400, height: 400}}
                />
            </View>

            <View className="space-y-4">
                <TouchableOpacity
                    onPress={()=> router.push("/Signup")
                        
                    }
                    className="py-3 bg-blue-100 mx-7 rounded-xl">
                        <Text className="text-xl font-bold text-center text-gray-700">
                            Sign UP 
                        </Text>
                    </TouchableOpacity>
                    
                <View className="flex-row justify-center">
                    <Text className="text-gray-20 font-semibold"> Already have an account</Text>   
                </View>

                <TouchableOpacity onPress={()=> 
                            router.push("/LoginScreen")
                            }>
                    <Text className="font-semibold text-gray-40 text-center">
                        LOG IN
                    </Text>
                </TouchableOpacity>


            </View>


            </View>
        </SafeAreaView>
    )
}
