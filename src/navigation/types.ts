export type RootStackParamList = {
  TaskList: undefined;
  AddTask:
    | {
        taskId?: string;
      }
    | undefined;
  TaskDetails: {
    taskId: string;
  };
};
