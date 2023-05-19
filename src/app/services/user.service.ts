import { User } from '@aneoconsultingfr/armonik.api.angular';
import { Injectable } from '@angular/core';

@Injectable()
export class UserService {
  user: User.AsObject;
}
