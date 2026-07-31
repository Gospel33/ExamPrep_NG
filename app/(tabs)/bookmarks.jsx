import { View, Text, StyleSheet } from 'react-native';

export default function BookmarksScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Bookmarks Screen Placeholder</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFC' },
  text: { fontSize: 16, color: '#6B7280' }
});
