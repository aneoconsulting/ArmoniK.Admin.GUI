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

export type ApplicationError = {
  // Unique id is the taskId
  taskId: string;
  applicationName: string;
  applicationVersion: string;
  sessionId: string;
  errorAt: string;
  error: {
    type: string;
    message: string;
  };
};
