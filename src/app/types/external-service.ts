export type ExternalService = {
    name: string;
    icon?: string;
    url: string;
};

export type ManageExternalServicesDialogData = {
    externalServices: ExternalService[];
};
export type AddExternalServiceDialogData = {};
export type EditExternalServiceDialogData = {
    externalService: ExternalService;
};
