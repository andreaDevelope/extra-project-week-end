import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: '.app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
})
export class NavComponent {
  constructor(private router: Router) {}

  navigate(index: number): void {
    const routes = ['/', '/login', '/home']; // Rotte associate ai tab
    this.router.navigate([routes[index]]);
  }
}
