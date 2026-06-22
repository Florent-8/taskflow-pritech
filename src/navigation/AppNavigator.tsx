import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { AddTaskScreen } from '@/screens/AddTaskScreen';
import { TaskDetailsScreen } from '@/screens/TaskDetailsScreen';
import { TaskListScreen } from '@/screens/TaskListScreen';
import { colors } from '@/theme';

import { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

const screenOptions = {
  contentStyle: {
    backgroundColor: colors.background,
  },
  headerShadowVisible: false,
  headerStyle: {
    backgroundColor: colors.background,
  },
  headerTintColor: colors.text,
  headerTitleStyle: {
    fontWeight: '800' as const,
  },
};

export function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="TaskList" screenOptions={screenOptions}>
        <Stack.Screen
          component={TaskListScreen}
          name="TaskList"
          options={taskListScreenOptions}
        />
        <Stack.Screen component={AddTaskScreen} name="AddTask" options={addTaskScreenOptions} />
        <Stack.Screen
          component={TaskDetailsScreen}
          name="TaskDetails"
          options={taskDetailsScreenOptions}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const taskListScreenOptions = {
  headerShown: false,
};

const addTaskScreenOptions = {
  title: 'Add task',
};

const taskDetailsScreenOptions = {
  title: 'Task details',
};
