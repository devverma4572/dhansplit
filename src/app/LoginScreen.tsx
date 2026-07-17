import { useNavigation } from '@react-navigation/native';
import { router } from 'expo-router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react';
import { Image, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { ArrowLeftIcon } from "react-native-heroicons/solid";
import { SafeAreaView } from 'react-native-safe-area-context';
import { auth } from "../../config/firebase";
import ScreenWrapper from './ScreenWrapper';


// import { LinearGradient } from 'react-native-svg';   

export default function LoginScreen() {
    const navigation = useNavigation();
    const themeColors = {
        bg: "#E8D700"
    };
    const [email, setEmail] = useState('');
    const [password, setPassword]  = useState('');

    const handleSubmit = async ()=>{
        console.log("Login Button pressed");
        console.log("email: ", email, "password: ", password);
         if(email && password){
             try{
                 await signInWithEmailAndPassword(auth, email, password);
                 router.push("/tabs/HomeScreen");
                }catch(err){ 
                 const message = err instanceof Error ? err.message : String(err);
                 console.log('got error: ', message);
             }
         }
    }



  return (
    <ScreenWrapper>
    <View className="flex-1 bg-white" 
        style={{backgroundColor: themeColors.bg}}>
        <SafeAreaView className='flex'>

            <View className='flex-row justify-start'>

                <TouchableOpacity 
                    onPress={()=> router.back()}
                    className='bg-yellow-500 p-2 rounded-tr-2xl rounded-bl-2xl ml-4 mt-6'>

                    <ArrowLeftIcon size="20" color="black"/>
                </TouchableOpacity>
            </View>
            <View className='flex-row justify-center'>
                <Image source={require('../../assets/images/login-clipart.png')}
                style={{width: 300, height: 200}}
                />
            </View>
        </SafeAreaView>


{/* --------------------- INPUT FORM FOR EMAIL AND PASSWORDS ---------------------------------- */}
        <View className='flex-1 px-8 pt-8 bg-blue-300
            rounded-tl-[50px] rounded-tr-[50px]'>
            <View className='form space-y-2'>
                <Text className='text-gray-700 ml-4 font-semibold'> Email Address</Text>

                 <TextInput className='p-4 bg-gray-100 text-black rounded-2xl mb-3 placeholder:font-semibold placeholder: color-black'
                    placeholder='Enter Email'
                    value={email}
                    onChangeText={value=> setEmail(value)}  
                    />

                <Text className='text-gray-700 ml-4'> Password </Text>
                 
                <TextInput className='p-4 bg-gray-100 text-gray-700 rounded-2xl mb-3'
                    
                    placeholder='Enter Password'
                    value={password}
                        onChangeText={value=> setPassword(value)
                        }
                    secureTextEntry
                    />
            
                <TouchableOpacity className='flex items-end mb-5'>
                    <Text className='text-gray-700'> Forgot Password</Text>
                </TouchableOpacity>


                <TouchableOpacity    style={{backgroundColor: "orange", padding: 20, marginTop: 20,}}
                onPress={handleSubmit}>
            
                <Text>Login</Text>
                </TouchableOpacity>

{/* ------------------------------------OR / GOOGLE ---------------------------------------------------------------------- */}
                <View>
                    <Text className='text-xl text-gray-700 font-bold text-center py-5'>
                        Or
                    </Text>
                    <View className='flex-row justify-center'>
                        <TouchableOpacity className='p-2 bg-white rounded-2xl'>
                            <Image source={require("../../assets/images/google.png")} className='w-10 h-10'/>
                        </TouchableOpacity>
                    </View>
                </View>
{/* --------------------------------------------------------------------------------------------------------------------------- */}

{/* --------------------------------------Already have account --------------------------------------------------------- */}
                <View className='flex-row justify-center'>
                    <Text className='align-center font-semibold mt-4'> Don't have an account    ? </Text>
                    <TouchableOpacity onPress={()=> router.push("/newsignup")}>
                        <Text className='font-semibold text-yellow-500 mt-4'> Sign-up</Text>
                    </TouchableOpacity>
                </View>
                


            </View>
        </View>


    </View>
    </ScreenWrapper>
  )
}
