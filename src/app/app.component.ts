import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

import { PrimeNGConfig } from 'primeng/api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  public displayHeader: boolean = false;

  constructor(
    private primengConfig: PrimeNGConfig,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  public ngOnInit(): void {
    this.primengConfig.ripple = true;

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.displayHeader =
          this.activatedRoute?.firstChild?.snapshot.data.displayHeader ?? true;
      }
    });
  }
}
