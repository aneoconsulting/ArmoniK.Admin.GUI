import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Observable, ObservableInput } from 'rxjs';

@Injectable()
export class GrpcErrorService {
  handleError(error, _: Observable<unknown>): ObservableInput<never> {
    switch (error.code) {
      case 5:
        throw new NotFoundException();
      default:
        throw new InternalServerErrorException(error.message);
    }
  }
}
