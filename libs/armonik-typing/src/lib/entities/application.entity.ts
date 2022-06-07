export type Application = {
  _id: {
    applicationName: string;
    applicationVersion: string;
  };
  countTasksPending?: number;
  countTasksError?: number;
  countTasksCompleted?: number;
  countTasksProcessing?: number;
};
