import {
  EventSubscriptionRequest,
  EventSubscriptionResponse,
  EventsClient,
} from '@aneoconsultingfr/armonik.api.angular';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class GrpcEventsService {
  private readonly client = inject(EventsClient);

  getEvents$(sessionId: string): Observable<EventSubscriptionResponse> {
    const request = new EventSubscriptionRequest({
      sessionId,
    });
    return this.client.getEvents(request);
  }
}
