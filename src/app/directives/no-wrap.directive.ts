import { Directive, ElementRef } from '@angular/core';

@Directive({ selector: '[appNoWrap]', standalone: true })
export class NoWrapDirective {
  constructor(private readonly el: ElementRef) {
    this.el.nativeElement.style.whiteSpace = 'nowrap';
  }
}
