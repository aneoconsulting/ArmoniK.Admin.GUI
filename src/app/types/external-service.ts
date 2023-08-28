export type ExternalService = {
  name: string;
  icon?: string;
  url: string;
};

export type ManageExternalServicesDialogData = {
  externalServices: ExternalService[];
};
export type AddExternalServiceDialogData = Record<string, never>;
export type EditExternalServiceDialogData = {
  externalService: ExternalService;
};
