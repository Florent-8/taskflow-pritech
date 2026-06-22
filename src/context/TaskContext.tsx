import { createContext, ReactNode, useContext, useMemo, useReducer } from 'react';

import { Task } from '@/types/task';

type TaskState = {
  tasks: Task[];
  isReady: boolean;
};

type TaskAction =
  | { type: 'SET_TASKS'; payload: Task[] }
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'TOGGLE_TASK'; payload: string }
  | { type: 'DELETE_TASK'; payload: string };

type TaskContextValue = TaskState & {
  setTasks: (tasks: Task[]) => void;
  addTask: (task: Task) => void;
  toggleTask: (taskId: string) => void;
  deleteTask: (taskId: string) => void;
  getTaskById: (taskId: string) => Task | undefined;
};

const initialState: TaskState = {
  tasks: [],
  isReady: false,
};

const TaskContext = createContext<TaskContextValue | undefined>(undefined);

function taskReducer(state: TaskState, action: TaskAction): TaskState {
  switch (action.type) {
    case 'SET_TASKS':
      return { tasks: action.payload, isReady: true };
    case 'ADD_TASK':
      return { ...state, tasks: [action.payload, ...state.tasks] };
    case 'TOGGLE_TASK':
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.payload ? { ...task, completed: !task.completed } : task,
        ),
      };
    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter((task) => task.id !== action.payload),
      };
    default:
      return state;
  }
}

type TaskProviderProps = {
  children: ReactNode;
};

export function TaskProvider({ children }: TaskProviderProps) {
  const [state, dispatch] = useReducer(taskReducer, initialState);

  const value = useMemo<TaskContextValue>(
    () => ({
      ...state,
      setTasks: (tasks) => dispatch({ type: 'SET_TASKS', payload: tasks }),
      addTask: (task) => dispatch({ type: 'ADD_TASK', payload: task }),
      toggleTask: (taskId) => dispatch({ type: 'TOGGLE_TASK', payload: taskId }),
      deleteTask: (taskId) => dispatch({ type: 'DELETE_TASK', payload: taskId }),
      getTaskById: (taskId) => state.tasks.find((task) => task.id === taskId),
    }),
    [state],
  );

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
}

export function useTasks() {
  const context = useContext(TaskContext);

  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider');
  }

  return context;
}
