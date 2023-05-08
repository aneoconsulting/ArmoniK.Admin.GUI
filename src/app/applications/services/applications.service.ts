import { ApplicationsClient, ListApplicationsRequest } from "@aneoconsultingfr/armonik.api.angular";
import { Injectable } from "@angular/core";

@Injectable()
export class ApplicationsService {
  constructor(private _applicationsClient: ApplicationsClient) {}

  listApplications() {
    const listApplicationsRequest = new ListApplicationsRequest({
      page: 0,
      pageSize: 10,
      sort: {
        direction: ListApplicationsRequest.OrderDirection.ORDER_DIRECTION_ASC,
        fields: [ListApplicationsRequest.OrderByField.ORDER_BY_FIELD_NAME]
      },
      filter: {
        name: '',
        namespace: '',
        service: '',
        version: '',
      }
    });

    return this._applicationsClient.listApplications(listApplicationsRequest);
  }
}
