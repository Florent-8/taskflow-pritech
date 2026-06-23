import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
  Alert,
  Pressable,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { EmptyState } from "@/components/EmptyState";
import { useTasks } from "@/context/TaskContext";
import { RootStackParamList } from "@/navigation/types";
import { colors, radii, spacing, typography } from "@/theme";
import { formatFullDate } from "@/utils/formatDate";

type TaskDetailsRoute = RouteProp<RootStackParamList, "TaskDetails">;
type TaskDetailsNavigation = NativeStackNavigationProp<
  RootStackParamList,
  "TaskDetails"
>;

export function TaskDetailsScreen() {
  const route = useRoute<TaskDetailsRoute>();
  const navigation = useNavigation<TaskDetailsNavigation>();
  const { getTaskById, toggleTask, deleteTask } = useTasks();
  const task = getTaskById(route.params.taskId);

  if (!task) {
    return (
      <View style={styles.screen}>
        <EmptyState
          title="Task not found"
          message="This task may have already been deleted."
        />
      </View>
    );
  }

  const confirmDelete = () => {
    const handleDelete = () => {
      deleteTask(task.id);
      navigation.goBack();
    };

    if (Platform.OS === "web") {
      const shouldDelete = window.confirm(`Delete "${task.title}"?`);

      if (shouldDelete) {
        handleDelete();
      }

      return;
    }

    Alert.alert("Delete task?", `"${task.title}" will be removed.`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: handleDelete,
      },
    ]);
  };

  const handleEdit = () => {
    navigation.navigate("AddTask", { taskId: task.id });
  };

  return (
    <ScrollView contentContainerStyle={styles.content} style={styles.screen}>
      <View style={styles.section}>
        <Text style={styles.title}>{task.title}</Text>
        <Text style={styles.createdDate}>{formatFullDate(task.createdAt)}</Text>
      </View>

      <View style={styles.statusPill}>
        <View
          style={[styles.statusDot, task.completed && styles.statusDotComplete]}
        />
        <Text style={styles.statusText}>
          {task.completed ? "Completed" : "Active"}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Description</Text>
        <Text style={styles.description}>{task.description}</Text>
      </View>

      <View style={styles.actions}>
        <Pressable
          accessibilityRole="button"
          style={styles.secondaryButton}
          onPress={handleEdit}
        >
          <Text style={styles.secondaryButtonText}>Edit task</Text>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          style={styles.primaryButton}
          onPress={() => toggleTask(task.id)}
        >
          <Text style={styles.primaryButtonText}>
            {task.completed ? "Mark active" : "Mark complete"}
          </Text>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          style={styles.deleteButton}
          onPress={confirmDelete}
        >
          <Text style={styles.deleteButtonText}>Delete task</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  actions: {
    gap: spacing.md,
  },
  content: {
    gap: spacing.xl,
    padding: spacing.lg,
  },
  createdDate: {
    color: colors.textMuted,
    fontSize: typography.caption,
  },
  deleteButton: {
    alignItems: "center",
    borderColor: colors.danger,
    borderRadius: radii.md,
    borderWidth: 1,
    justifyContent: "center",
    minHeight: 52,
  },
  deleteButtonText: {
    color: colors.danger,
    fontSize: typography.body,
    fontWeight: "800",
  },
  description: {
    color: colors.text,
    fontSize: typography.body,
    lineHeight: 24,
  },
  primaryButton: {
    alignItems: "center",
    backgroundColor: colors.primary,
    borderRadius: radii.md,
    justifyContent: "center",
    minHeight: 52,
  },
  primaryButtonText: {
    color: colors.white,
    fontSize: typography.body,
    fontWeight: "800",
  },
  secondaryButton: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.md,
    borderWidth: 1,
    justifyContent: "center",
    minHeight: 52,
  },
  secondaryButtonText: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: "800",
  },
  screen: {
    backgroundColor: colors.background,
    flex: 1,
  },
  section: {
    gap: spacing.sm,
  },
  sectionLabel: {
    color: colors.textMuted,
    fontSize: typography.caption,
    fontWeight: "800",
    textTransform: "uppercase",
  },
  statusDot: {
    backgroundColor: colors.textMuted,
    borderRadius: radii.round,
    height: 10,
    width: 10,
  },
  statusDotComplete: {
    backgroundColor: colors.success,
  },
  statusPill: {
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.round,
    borderWidth: 1,
    flexDirection: "row",
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  statusText: {
    color: colors.text,
    fontSize: typography.caption,
    fontWeight: "800",
  },
  title: {
    color: colors.text,
    fontSize: typography.title,
    fontWeight: "800",
  },
});
