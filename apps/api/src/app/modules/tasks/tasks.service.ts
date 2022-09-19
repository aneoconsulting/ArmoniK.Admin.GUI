import { TaskStatus } from '@armonik.admin.gui/armonik-typing';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Submitter } from '../../common';

@Injectable()
export class TasksService implements OnModuleInit {
  private submitterService: Submitter;

  constructor(@Inject('Submitter') private readonly client: ClientGrpc) {}

  onModuleInit() {
    this.submitterService = this.client.getService<Submitter>('Submitter');
  }

  /**
   * Cancel tasks
   *
   * @param ids Ids of the tasks
   */
  cancelMany(ids: string[]) {
    return this.submitterService.CancelTasks({
      task: { ids },
      // only tasks that can be cancelled
      included: {
        statuses: [
          TaskStatus.CREATING,
          TaskStatus.SUBMITTED,
          TaskStatus.DISPATCHED,
        ],
      },
    });
  }
}
