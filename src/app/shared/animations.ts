import { animate, state, style, transition, trigger } from '@angular/animations';

export const rotateFull = trigger('rotateFull', [
  state('true', style({ transform: 'rotate(-180deg)' })),
  state('false', style({ transform: 'rotate(0deg)' })),
  transition('true <=> false', [animate('125ms ease-in')])
]);