export type Application = {
  _id: {
    applicationName: string;
    version: string;
  };
  countTasksPending?: number;
  countTasksError?: number;
  countTasksCompleted?: number;
  countTasksProcessing?: number;
};
