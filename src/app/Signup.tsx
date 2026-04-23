import React, { useState } from 'react'
import {Image, View, Text, TouchableOpacity, TextInput} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {ArrowLeftIcon} from "react-native-heroicons/solid";
import { useNavigation } from '@react-navigation/native';
import { router } from 'expo-router';
import { createUserWithEmailAndPassword, signOut, updateProfile, UserCredential } from 'firebase/auth';
import { auth } from "../../config/firebase"
// import { useState } from "react"; 
// import { LinearGradient } from 'react-native-svg';   

export default function LoginScreen() {
    const navigation = useNavigation(); 
    const themeColors = {
        bg: "#E8D700"
    };
    const[name, setName] = useState('');
    const [email, setEmail] = useState('');
    const[password, setPassword] = useState('');

    const handleSubmit = async ()=>{
        if(name && email && password){
            try{
                const UserCredential = await createUserWithEmailAndPassword(auth, email, password);
                await updateProfile(UserCredential.user,{
                    displayName: name,
                })
                router.push("/tabs/HomeScreen");
            }catch(err){ 
                const message = err instanceof Error ? err.message : String(err);
                console.log('got error: ', message);
            }
        }
    }
    const handleLogout = async() =>{
        await signOut(auth);
    }
     

  return (
    <View className="flex-1 bg-white" 
        style={{backgroundColor: themeColors.bg}}>
        <SafeAreaView className='flex'>

            <View className='flex-row justify-start pt-5'>

                <TouchableOpacity onPress={()=>router.back()}
                        
                    className='bg-yellow-500 p-2 rounded-tr-2xl rounded-bl-2xl ml-4 mt-dsx'>

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
                <Text className='text-gray-700 ml-4 font-semibold'> Full Name</Text>

                 <TextInput className='p-4 bg-gray-100 text-gray-700 rounded-2xl mb-3 placeholder:font-semibold placeholder: color-white'
                    placeholder='Enter your Name'
                    onChangeText={value=> setName(value)}
                    />
                <Text className='text-gray-700 ml-4 font-semibold'> Email Address</Text>

                 <TextInput className='p-4 bg-gray-100 text-gray-700 rounded-2xl mb-3 placeholder:font-semibold placeholder: color-white'
                    onChangeText={value=> setEmail(value)}
                    placeholder='Enter Email'/>

                <Text className='text-gray-700 ml-4'> Password </Text>
                 
                <TextInput className='p-4 bg-gray-100 text-gray-700 rounded-2xl mb-3'
                    secureTextEntry
                    value={password}
                    onChangeText={value => setPassword(value)}
                    placeholder='Enter Password'/>
            
                {/* <TouchableOpacity className='flex items-end mb-5'>
                    <Text className='text-gray-700'> Forgot Password</Text>
                </TouchableOpacity> */}

                <TouchableOpacity onPress={handleSubmit}> 
                    <Text
                        className="px-6 py-3 text-white font-semibold rounded-xl 
                        bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500
                        shadow-lg shadow-purple-500/30
                        hover:scale-105 hover:shadow-xl hover:shadow-purple-500/40
                        active:scale-95
                        transition-all duration-300 ease-in-out
                        mt-5">
                            
                        Sign-up
                    </Text>
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
                    <Text className='align-center font-semibold mt-4'> Already Registered ? </Text>
                    <TouchableOpacity onPress={()=> router.push("/LoginScreen")}>
                        <Text className='font-semibold text-yellow-500 mt-4'> Log-In</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleLogout}>
                        <Text>
                            Signout
                        </Text>
                    </TouchableOpacity>
                </View>
                


            </View>
        </View>
    </View>
  )
}
