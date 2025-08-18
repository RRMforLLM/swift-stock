import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Button } from 'react-native';

export const ExportDbButton = () => {
  const exportDb = async () => {
    const dbUri = FileSystem.documentDirectory + 'SQLite/app.db';
    const fileInfo = await FileSystem.getInfoAsync(dbUri);

    if (fileInfo.exists) {
      await Sharing.shareAsync(dbUri);
    } else {
      console.log('Database file not found at:', dbUri);
    }
  };

  return <Button title="Export DB" onPress={exportDb} />;
};
