import { EventsClient, EventSubscriptionRequest } from '@aneoconsultingfr/armonik.api.angular';
import { TestBed } from '@angular/core/testing';
import { GrpcEventsService } from './grpc-events.service';

describe('GrpcEventsService', () => {
  let service: GrpcEventsService;

  const mockEventsClient = {
    getEvents: jest.fn(),
  };

  beforeEach(() => {
    service = TestBed.configureTestingModule({
      providers: [
        GrpcEventsService,
        { provide: EventsClient, useValue: mockEventsClient },
      ],
    }).inject(GrpcEventsService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('should get events', () => {
    const sessionId = 'session';
    service.getEvents$(sessionId);
    expect(mockEventsClient.getEvents).toHaveBeenCalledWith(new EventSubscriptionRequest({
      sessionId: sessionId,
    }));
  });
});