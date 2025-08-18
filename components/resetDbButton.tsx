import * as FileSystem from 'expo-file-system';
import { Alert, Button, View } from 'react-native';

export const ResetDbButton = () => {
  const deleteDb = async () => {
    const dbUri = FileSystem.documentDirectory + 'SQLite/app.db';
    const fileInfo = await FileSystem.getInfoAsync(dbUri);

    if (fileInfo.exists) {
      await FileSystem.deleteAsync(dbUri, { idempotent: true });
      Alert.alert('Success', 'Old app.db deleted. Relaunch the app to recreate it.');
    } else {
      Alert.alert('Nothing to delete', 'No existing app.db file found.');
    }
  };

  return (
    <View>
      <Button title="🗑️ Delete app.db" onPress={deleteDb} />
    </View>
  );
};
