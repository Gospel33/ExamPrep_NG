import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* App boots directly here into your Splash index screen first */}
      <Stack.Screen name="index" />
      
      {/* Other Screens */}
      <Stack.Screen name="(onboard)" />
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(app)" />
    </Stack>
  );
}
