import { Component, OnInit } from '@angular/core';

import { PrimeNGConfig } from 'primeng/api';

@Component({
  selector: 'aqm-prime-ng-container',
  template: `<ng-content></ng-content>`,
})
export class PrimeNgContainerComponent implements OnInit {
  constructor(private primengConfig: PrimeNGConfig) {}

  public ngOnInit(): void {
    this.primengConfig.ripple = true;
  }
}
