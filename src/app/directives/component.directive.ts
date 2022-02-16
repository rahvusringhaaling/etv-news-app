import { Directive, OnInit, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[compHost]'
})
export class ComponentDirective implements OnInit {

  constructor(public viewContainerRef: ViewContainerRef) { }

  ngOnInit() {
    console.log('Directive loaded');
  }
}
