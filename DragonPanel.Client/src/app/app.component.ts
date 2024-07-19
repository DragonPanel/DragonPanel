import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { NotificationService } from './services/notification.service';
import { MessageService } from 'primeng/api';
import { filter, map, Subject, takeUntil, tap } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { LayoutComponent } from "./layout/layout.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    ToastModule,
    RouterOutlet,
    AsyncPipe,
    LayoutComponent
],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, OnDestroy {
  #notificationService = inject(NotificationService);
  #messageService = inject(MessageService);
  #destroy$ = new Subject<void>();
  #router = inject(Router);

  layoutless$ = this.#router.events.pipe(
    filter(e => e instanceof NavigationEnd),
    map(e => !!this.#router.routerState.root.firstChild?.snapshot.data['layoutless'])
  );

  ngOnInit(): void {
    this.#notificationService.notification$.pipe(
      takeUntil(this.#destroy$)
    ).subscribe(notification => {
      this.#messageService.add({
        severity: notification.severity,
        summary: notification.title,
        detail: notification.content
      });
    })
  }

  ngOnDestroy(): void {
    this.#destroy$.next();
  }
}
