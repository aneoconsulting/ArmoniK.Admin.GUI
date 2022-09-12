import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ObservableInput } from 'rxjs';
import { status } from '@grpc/grpc-js';

@Injectable()
export class GrpcErrorService {
  private readonly logger = new Logger(GrpcErrorService.name);

  public handleError(error): ObservableInput<never> {
    this.logger.error(error);
    switch (error.code) {
      case status.NOT_FOUND:
        throw new NotFoundException();
      default:
        throw new InternalServerErrorException(error.message);
    }
  }
}
