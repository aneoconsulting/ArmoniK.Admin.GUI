export type ConfirmationDialogData = {
  title?: string;
  content: string[];
  actions?: {
    cancel: string;
    confirm: string;
  };
}