import AsyncStorage from '@react-native-async-storage/async-storage';

import { Task } from '@/types/task';
import { createTaskId } from '@/utils/createTaskId';

const HAS_SEEDED_TASKS_KEY = 'taskflow:hasSeededTasks';
const SEED_URL = 'https://jsonplaceholder.typicode.com/todos?_limit=5';

type PlaceholderTodo = {
  id: number;
  title: string;
  completed: boolean;
};

function isPlaceholderTodo(value: unknown): value is PlaceholderTodo {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as Record<string, unknown>;

  return (
    typeof candidate.id === 'number' &&
    typeof candidate.title === 'string' &&
    typeof candidate.completed === 'boolean'
  );
}

export async function getSeedTasksForFirstLaunch(): Promise<Task[] | null> {
  const hasSeededTasks = await AsyncStorage.getItem(HAS_SEEDED_TASKS_KEY);

  if (hasSeededTasks === 'true') {
    return null;
  }

  try {
    const response = await fetch(SEED_URL);

    if (!response.ok) {
      return [];
    }

    const data: unknown = await response.json();
    const createdAt = new Date().toISOString();

    return Array.isArray(data)
      ? data.filter(isPlaceholderTodo).map((todo) => ({
          id: createTaskId(),
          title: todo.title,
          description: 'Imported from JSONPlaceholder demo API',
          completed: todo.completed,
          createdAt,
        }))
      : [];
  } catch {
    return [];
  } finally {
    await AsyncStorage.setItem(HAS_SEEDED_TASKS_KEY, 'true');
  }
}
