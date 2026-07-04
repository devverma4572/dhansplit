 import { Stack } from "expo-router";
import { configureReanimatedLogger, ReanimatedLogLevel } from 'react-native-reanimated';
import "../global.css";

configureReanimatedLogger({
  level: ReanimatedLogLevel.error,
  strict: false,
});

export default function AppLayout() {
  return(
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{headerShown: false}} />
      <Stack.Screen name="(modals)/Profile-Modal" 
       options={{
        headerShown: false,
        presentation: "modal",
      }}/>
      <Stack.Screen name="WelcomeScreen " options={{headerShown: false}}/>
      <Stack.Screen name="Signup" options={{headerShown: false}}/>
      <Stack.Screen name="LoginScreen" options={{headerShown: false}}/>
      <Stack.Screen name="tabs" options={{headerShown: false}}/>
    </Stack>
    
  )
}
