import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="signup1" />
      <Stack.Screen name="signup2" />
      <Stack.Screen name="forgot" />
      <Stack.Screen name="verify" />
      <Stack.Screen name="reset" />
    </Stack>
  );
}
