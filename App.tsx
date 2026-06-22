import 'react-native-gesture-handler';

import { StatusBar } from 'expo-status-bar';

import { TaskProvider } from '@/context/TaskContext';
import { AppNavigator } from '@/navigation/AppNavigator';

export default function App() {
  return (
    <TaskProvider>
      <AppNavigator />
      <StatusBar style="auto" />
    </TaskProvider>
  );
}
