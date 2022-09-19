export interface Task {
  id: string;
  status: number;
  startedAt: string;
  endedAt: string;
  output?: {
    success: boolean;
    error: string;
  };
}
