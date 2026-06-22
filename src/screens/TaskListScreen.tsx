import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { Alert, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import { EmptyState } from '@/components/EmptyState';
import { TaskListItem } from '@/components/TaskListItem';
import { useTasks } from '@/context/TaskContext';
import { RootStackParamList } from '@/navigation/types';
import { colors, radii, spacing, typography } from '@/theme';
import { Task } from '@/types/task';

type TaskListNavigation = NativeStackNavigationProp<RootStackParamList, 'TaskList'>;

function sortNewestFirst(tasks: Task[]): Task[] {
  return [...tasks].sort(
    (first, second) => new Date(second.createdAt).getTime() - new Date(first.createdAt).getTime(),
  );
}

export function TaskListScreen() {
  const navigation = useNavigation<TaskListNavigation>();
  const { tasks, isReady, toggleTask, deleteTask } = useTasks();
  const sortedTasks = sortNewestFirst(tasks);

  const confirmDelete = (task: Task) => {
    Alert.alert('Delete task?', `"${task.title}" will be removed.`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteTask(task.id) },
    ]);
  };

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.heading}>TaskFlow</Text>
        <Text style={styles.subheading}>Keep personal tasks moving.</Text>
      </View>

      <FlatList
        contentContainerStyle={styles.listContent}
        data={sortedTasks}
        keyExtractor={(task) => task.id}
        ListEmptyComponent={
          <EmptyState
            title={isReady ? 'No tasks yet' : 'Loading tasks'}
            message={
              isReady
                ? 'Add your first task and it will show up here.'
                : 'Your saved tasks are being prepared.'
            }
          />
        }
        renderItem={({ item }) => (
          <TaskListItem
            task={item}
            onDelete={() => confirmDelete(item)}
            onPress={() => navigation.navigate('TaskDetails', { taskId: item.id })}
            onToggle={() => toggleTask(item.id)}
          />
        )}
      />

      <Pressable
        accessibilityLabel="Add task"
        accessibilityRole="button"
        style={styles.fab}
        onPress={() => navigation.navigate('AddTask')}
      >
        <Text style={styles.fabText}>+</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  fab: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: radii.round,
    bottom: spacing.xl,
    elevation: 4,
    height: 58,
    justifyContent: 'center',
    position: 'absolute',
    right: spacing.xl,
    shadowColor: colors.text,
    shadowOffset: { height: 6, width: 0 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    width: 58,
  },
  fabText: {
    color: colors.white,
    fontSize: 34,
    lineHeight: 38,
  },
  header: {
    gap: spacing.xs,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
  },
  heading: {
    color: colors.text,
    fontSize: typography.title,
    fontWeight: '800',
  },
  listContent: {
    gap: spacing.md,
    padding: spacing.lg,
    paddingBottom: 104,
  },
  screen: {
    backgroundColor: colors.background,
    flex: 1,
  },
  subheading: {
    color: colors.textMuted,
    fontSize: typography.body,
  },
});
