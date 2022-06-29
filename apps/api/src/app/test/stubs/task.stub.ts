import { TaskStatus, RawTask } from '@armonik.admin.gui/armonik-typing';

export const TaskStub: RawTask = {
  _id: '9ac0311e-a8e0-40d5-b11e-07e143032a0b',
  SessionId: '992b9227-da15-4fe3-985b-fcf56c1e848e',
  Options: {
    Options: { GridAppName: 'appName', GridAppVersion: 'appVersion' },
  },
  Status: TaskStatus.COMPLETED,
  StartDate: new Date(),
};
