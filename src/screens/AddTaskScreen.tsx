import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { useEffect, useMemo, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { useTasks } from "@/context/TaskContext";
import { RootStackParamList } from "@/navigation/types";
import { colors, radii, spacing, typography } from "@/theme";
import { createTaskId } from "@/utils/createTaskId";
import { isTaskFormValid, validateTaskForm } from "@/utils/validation";

type AddTaskNavigation = NativeStackNavigationProp<
  RootStackParamList,
  "AddTask"
>;
type AddTaskRoute = RouteProp<RootStackParamList, "AddTask">;

export function AddTaskScreen() {
  const navigation = useNavigation<AddTaskNavigation>();
  const route = useRoute<AddTaskRoute>();
  const { addTask, getTaskById, updateTask } = useTasks();
  const existingTask = route.params?.taskId
    ? getTaskById(route.params.taskId)
    : undefined;
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const values = useMemo(() => ({ title, description }), [description, title]);
  const errors = useMemo(() => validateTaskForm(values), [values]);
  const canSubmit = isTaskFormValid(values);

  useEffect(() => {
    if (existingTask) {
      setTitle(existingTask.title);
      setDescription(existingTask.description);
      setHasSubmitted(false);
    }
  }, [existingTask]);

  useEffect(() => {
    navigation.setOptions({ title: existingTask ? "Edit task" : "Add task" });
  }, [existingTask, navigation]);

  const handleSubmit = () => {
    setHasSubmitted(true);

    if (!canSubmit) {
      return;
    }

    const normalizedTitle = title.trim();
    const normalizedDescription = description.trim();

    if (existingTask) {
      updateTask({
        ...existingTask,
        title: normalizedTitle,
        description: normalizedDescription,
      });
    } else {
      addTask({
        id: createTaskId(),
        title: normalizedTitle,
        description: normalizedDescription,
        completed: false,
        createdAt: new Date().toISOString(),
      });
    }

    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.select({ ios: "padding", android: undefined })}
      style={styles.screen}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.field}>
          <Text style={styles.label}>Title</Text>
          <TextInput
            autoCapitalize="sentences"
            autoFocus={!existingTask}
            placeholder="e.g. Plan weekly priorities"
            placeholderTextColor={colors.textMuted}
            style={styles.input}
            value={title}
            onBlur={() => setHasSubmitted(true)}
            onChangeText={setTitle}
          />
          {hasSubmitted && errors.title ? (
            <Text style={styles.error}>{errors.title}</Text>
          ) : null}
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            multiline
            placeholder="Add a useful note for future you."
            placeholderTextColor={colors.textMuted}
            style={[styles.input, styles.descriptionInput]}
            textAlignVertical="top"
            value={description}
            onBlur={() => setHasSubmitted(true)}
            onChangeText={setDescription}
          />
          {hasSubmitted && errors.description ? (
            <Text style={styles.error}>{errors.description}</Text>
          ) : null}
        </View>

        <Pressable
          accessibilityRole="button"
          disabled={!canSubmit}
          style={[
            styles.submitButton,
            !canSubmit && styles.submitButtonDisabled,
          ]}
          onPress={handleSubmit}
        >
          <Text style={styles.submitButtonText}>
            {existingTask ? "Save changes" : "Create task"}
          </Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.lg,
    padding: spacing.lg,
  },
  descriptionInput: {
    minHeight: 140,
    paddingTop: spacing.md,
  },
  error: {
    color: colors.danger,
    fontSize: typography.caption,
    fontWeight: "600",
  },
  field: {
    gap: spacing.sm,
  },
  input: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.md,
    borderWidth: 1,
    color: colors.text,
    fontSize: typography.body,
    minHeight: 52,
    paddingHorizontal: spacing.lg,
  },
  label: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: "700",
  },
  screen: {
    backgroundColor: colors.background,
    flex: 1,
  },
  submitButton: {
    alignItems: "center",
    backgroundColor: colors.primary,
    borderRadius: radii.md,
    justifyContent: "center",
    minHeight: 52,
  },
  submitButtonDisabled: {
    backgroundColor: colors.border,
  },
  submitButtonText: {
    color: colors.white,
    fontSize: typography.body,
    fontWeight: "800",
  },
});
