import { Directive, ElementRef } from '@angular/core';

@Directive({ selector: '[appNoWrap]' })
export class NoWrapDirective {
  constructor(private readonly el: ElementRef) {
    this.el.nativeElement.style.whiteSpace = 'nowrap';
  }
}
