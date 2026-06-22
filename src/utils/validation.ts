type TaskFormValues = {
  title: string;
  description: string;
};

export type TaskFormErrors = Partial<Record<keyof TaskFormValues, string>>;

export function validateTaskForm(values: TaskFormValues): TaskFormErrors {
  const errors: TaskFormErrors = {};
  const title = values.title.trim();
  const description = values.description.trim();

  if (title.length < 3) {
    errors.title = 'Title must be at least 3 characters.';
  }

  if (description.length < 5) {
    errors.description = 'Description must be at least 5 characters.';
  }

  return errors;
}

export function isTaskFormValid(values: TaskFormValues): boolean {
  return Object.keys(validateTaskForm(values)).length === 0;
}
