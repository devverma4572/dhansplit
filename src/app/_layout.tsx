import "../global.css";
import { Stack } from "expo-router";

export default function AppLayout() {
  return(
    <Stack>
      <Stack.Screen name="index" options={{headerShown: false}} />
      <Stack.Screen name="WelcomeScreen" options={{headerShown: false}}/>
      <Stack.Screen name="Signup" options={{headerShown: false}}/>
      <Stack.Screen name="LoginScreen" options={{headerShown: false}}/>

      <Stack.Screen name="(tabs)" options={{headerShown: false}}/>
    </Stack>
    
  )
}
