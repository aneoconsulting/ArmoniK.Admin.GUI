import { Controller, Get, Inject } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { SubmitterService } from './interfaces/SubmitterService.interface';

@Controller()
export class AppController {
  private submitter: SubmitterService;

  constructor(
    @Inject('SUBMITTER_PACKAGE') private readonly client: ClientGrpc
  ) {}

  onModuleInit() {
    this.submitter = this.client.getService<SubmitterService>('Submitter');
  }

  @Get('countTasks')
  index(): Observable<any> {
    const staticOptions = {
      included: {
        Statuses: ['TASK_STATUS_FAILED', 'TASK_STATUS_COMPLETED', 6, 0, 9],
      },
      task: {
        ids: ['reprehenderit ullamco ad sunt ut'],
      },
    };
    return this.submitter.countTasks(staticOptions);
  }
}
