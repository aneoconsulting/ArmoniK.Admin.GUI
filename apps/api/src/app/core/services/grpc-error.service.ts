import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Observable, ObservableInput } from 'rxjs';
import { status } from '@grpc/grpc-js';

@Injectable()
export class GrpcErrorService {
  handleError(error, _: Observable<unknown>): ObservableInput<never> {
    switch (error.code) {
      case status.NOT_FOUND:
        throw new NotFoundException();
      default:
        throw new InternalServerErrorException(error.message);
    }
  }
}
