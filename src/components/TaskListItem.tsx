import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radii, spacing, typography } from '@/theme';
import { Task } from '@/types/task';
import { formatShortDate } from '@/utils/formatDate';

type TaskListItemProps = {
  task: Task;
  onPress: () => void;
  onToggle: () => void;
  onDelete: () => void;
};

export function TaskListItem({ task, onPress, onToggle, onDelete }: TaskListItemProps) {
  return (
    <Pressable style={styles.container} onPress={onPress}>
      <Pressable
        accessibilityLabel={task.completed ? 'Mark task active' : 'Mark task complete'}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: task.completed }}
        style={[styles.checkbox, task.completed && styles.checkboxChecked]}
        onPress={onToggle}
      >
        <Text style={styles.checkboxLabel}>{task.completed ? '✓' : ''}</Text>
      </Pressable>

      <View style={styles.content}>
        <Text numberOfLines={1} style={[styles.title, task.completed && styles.completedTitle]}>
          {task.title}
        </Text>
        <Text style={styles.date}>{formatShortDate(task.createdAt)}</Text>
      </View>

      <Pressable
        accessibilityLabel={`Delete ${task.title}`}
        accessibilityRole="button"
        hitSlop={spacing.sm}
        style={styles.deleteButton}
        onPress={onDelete}
      >
        <Text style={styles.deleteButtonText}>×</Text>
      </Pressable>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.md,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.md,
    minHeight: 74,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  checkbox: {
    alignItems: 'center',
    borderColor: colors.primary,
    borderRadius: radii.round,
    borderWidth: 2,
    height: 26,
    justifyContent: 'center',
    width: 26,
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
  },
  checkboxLabel: {
    color: colors.white,
    fontSize: typography.caption,
    fontWeight: '800',
  },
  completedTitle: {
    color: colors.textMuted,
    textDecorationLine: 'line-through',
  },
  content: {
    flex: 1,
    gap: spacing.xs,
  },
  date: {
    color: colors.textMuted,
    fontSize: typography.caption,
  },
  deleteButton: {
    alignItems: 'center',
    borderRadius: radii.round,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  deleteButtonText: {
    color: colors.danger,
    fontSize: 28,
    lineHeight: 30,
  },
  title: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: '700',
  },
});
