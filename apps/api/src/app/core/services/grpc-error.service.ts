import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Observable, ObservableInput } from 'rxjs';
import { status } from '@grpc/grpc-js';

@Injectable()
export class GrpcErrorService {
  private readonly logger = new Logger(GrpcErrorService.name);

  handleError(error, _: Observable<unknown>): ObservableInput<never> {
    this.logger.error(error);
    switch (error.code) {
      case status.NOT_FOUND:
        throw new NotFoundException();
      default:
        throw new InternalServerErrorException(error.message);
    }
  }
}
