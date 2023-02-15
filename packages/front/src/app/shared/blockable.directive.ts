import { Directive, ElementRef } from '@angular/core';
import { BlockableUI } from 'primeng/api';

@Directive({
  selector: '[appBlockable]',
  exportAs: 'appBlockable'
})
export class BlockableDirective implements BlockableUI {

  constructor(private element: ElementRef) { }

  getBlockableElement(): HTMLElement {
    return this.element.nativeElement;
  }

}
