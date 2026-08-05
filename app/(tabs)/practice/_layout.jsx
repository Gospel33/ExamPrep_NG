import { Stack } from "expo-router";

export default function PracticeLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
     
      <Stack.Screen name="index" />
      <Stack.Screen name="setup-1" />
      <Stack.Screen name="setup-2" />
      <Stack.Screen name="startPage" />
      <Stack.Screen name="endPage" />
    </Stack>
  );
}
