import { Timestamp } from '@ngx-grpc/well-known-types';
import { TimeKeys } from '@app/types/data';
import { TimeLineComponent } from './timeline.component';

describe('TimeLineComponent', () => {
  const component = new TimeLineComponent;
  const timeKeys: TimeKeys[] = ['createdAt', 'processedAt', 'endedAt'];
  const timestamps = {
    createdAt: new Timestamp({seconds: '13434980'}),
    submittedAt: new Timestamp({seconds: '13434982'}),
    processedAt: new Timestamp({seconds: '13434983'}),
    endedAt: new Timestamp({seconds: '13434985'}),
  };

  beforeEach(() => {
    component.keys = [...timeKeys];
    component.timestamps = {...timestamps};
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should properly set timeKeys', () => {
    expect(component.keys).toEqual(timeKeys);
  });

  it('should set prettyKeys', () => {
    expect(component.prettyKeys).toEqual(['Created', 'Processed', 'Ended']);
  });

  it('should set timestamps according timeKeys', () => {
    expect(component.dates).toEqual({
      createdAt: timestamps.createdAt.toDate(),
      processedAt: timestamps.processedAt.toDate(),
      endedAt: timestamps.endedAt.toDate()
    });
  });

  it('should make a key more pretty', () => {
    expect(component.prettyKey('submittedAt')).toEqual('Submitted');
  });
});