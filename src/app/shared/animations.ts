import { animate, state, style, transition, trigger } from '@angular/animations';

export const rotateFull = trigger('rotateFull', [
  state('true', style({ transform: 'rotate(-180deg)' })),
  state('false', style({ transform: 'rotate(0deg)' })),
  transition('true <=> false', [animate('125ms ease-in')])
]);

export const expand = trigger('expand', [
  state('false', style({ 'height': '0' })),
  state('true', style({})),
  transition('true <=> false', [animate('500ms cubic-bezier(0.4, 0.0, 0.2, 1)')])
]);