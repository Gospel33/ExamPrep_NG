import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{headerShown: false}}>
      {/* <Stack.Screen name="auth" /> */}
      <Stack.Screen name="auth/login" />
      <Stack.Screen name="auth/sign-up" />
      <Stack.Screen name="auth/verify-email" />
      <Stack.Screen name="auth/account-created" />
    </Stack>
  )
}
