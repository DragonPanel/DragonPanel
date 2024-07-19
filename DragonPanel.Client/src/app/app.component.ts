import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { NotificationService } from './services/notification.service';
import { MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    ToastModule,
    RouterOutlet
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, OnDestroy {
  #notificationService = inject(NotificationService);
  #messageService = inject(MessageService);
  #destroy$ = new Subject<void>();

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
