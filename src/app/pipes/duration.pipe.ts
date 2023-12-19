import { Pipe, PipeTransform } from '@angular/core';
import { Duration } from '@ngx-grpc/well-known-types';

@Pipe({ name: 'duration', standalone: true })
export class DurationPipe  implements PipeTransform {
  transform(value: Duration | null) {
    if (!value) {
      return null;
    }

    const seconds = Number(value.seconds) || 0;
    const nano = value.nanos || 0;
    if (seconds === 0 && nano === 0) {
      return null;
    }

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds - (hours * 3600)) / 60);
    const secondsRemaining = seconds - (hours * 3600) - (minutes * 60);
    const millis = Math.round((nano * Math.pow(10, -6))*1000)/1000;

    const hoursStr = hours > 0 ? `${hours}h ` : '';
    const minutesStr = minutes > 0 ? `${minutes}m ` : '';
    const secondsStr = secondsRemaining > 0 ? `${secondsRemaining}s ` : '';
    const millisStr = millis > 0 ? `${millis}ms` : '';

    return `${hoursStr}${minutesStr}${secondsStr}${millisStr}`.trim();
  }
}
