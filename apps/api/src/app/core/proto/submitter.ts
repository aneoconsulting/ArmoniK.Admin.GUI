// Type definitions from proto file

export interface Submitter {
  CancelTasks(TaskFilter: TaskFilter): Promise<Record<string, never>>;
}

interface TaskFilter {
  task: {
    ids: string[];
  };
}
