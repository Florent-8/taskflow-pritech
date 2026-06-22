import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { useMemo, useState } from 'react';
import { Alert, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import { EmptyState } from '@/components/EmptyState';
import { FilterBar } from '@/components/FilterBar';
import { SearchBar } from '@/components/SearchBar';
import { TaskListItem } from '@/components/TaskListItem';
import { useTasks } from '@/context/TaskContext';
import { RootStackParamList } from '@/navigation/types';
import { colors, radii, spacing, typography } from '@/theme';
import { Task, TaskFilter } from '@/types/task';

type TaskListNavigation = NativeStackNavigationProp<RootStackParamList, 'TaskList'>;

function sortNewestFirst(tasks: Task[]): Task[] {
  return [...tasks].sort(
    (first, second) => new Date(second.createdAt).getTime() - new Date(first.createdAt).getTime(),
  );
}

export function TaskListScreen() {
  const navigation = useNavigation<TaskListNavigation>();
  const { tasks, isReady, toggleTask, deleteTask } = useTasks();
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<TaskFilter>('all');
  const visibleTasks = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return sortNewestFirst(tasks).filter((task) => {
      const matchesSearch = task.title.toLowerCase().includes(normalizedQuery);
      const matchesFilter =
        filter === 'all' ||
        (filter === 'completed' && task.completed) ||
        (filter === 'active' && !task.completed);

      return matchesSearch && matchesFilter;
    });
  }, [filter, searchQuery, tasks]);

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

      <View style={styles.controls}>
        <SearchBar value={searchQuery} onChangeText={setSearchQuery} />
        <FilterBar value={filter} onChange={setFilter} />
      </View>

      <FlatList
        contentContainerStyle={styles.listContent}
        data={visibleTasks}
        keyExtractor={(task) => task.id}
        ListEmptyComponent={
          <EmptyState
            title={isReady ? 'No matching tasks' : 'Loading tasks'}
            message={
              isReady
                ? 'Try a different search or filter, or add something new.'
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
  controls: {
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
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
