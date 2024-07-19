import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';

/**
 * Handles notification storing, showing and retrieving.
 *
 * There are 2 types of notifications:
 * - Client notifications are created by the client code and stored only in current tab and current session.
 *   Client notification will vanish after page refresh. They're used to show client related informations and errors.
 *   All `notify` methods in NotificationService will create client notification.
 * - Server notifications are created, emitted and stored by the server.
 *   NotificationService provides methods to mark notification as read and delete it.
 *
 * Use observable notification$ to listen to any new notifications.
 * Use observable notifications$ to listen to notification store array changes.
 */
@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  #notifications: ReadonlyArray<Readonly<INotification>> = [];
  #notificationSub$ = new Subject<Readonly<INotification>>();
  #notificationsSub$ = new BehaviorSubject<ReadonlyArray<INotification>>(this.#notifications);
  #lastClientId = 0;

  public get notification$() {
    return this.#notificationSub$.asObservable();
  }
  public get notifications$() {
    return this.#notificationsSub$.asObservable();
  }

  public success(title: string, content?: string) {
    this.notify("success", title, content);
  }
  public info(title: string, content: string) {
    this.notify("info", title, content);
  }
  public warning(title: string, content?: string) {
    this.notify("warn", title, content);
  }
  public error(title: string, content?: string) {
    this.notify("error", title, content);
  }

  public notify(severity: TSeverity, title: string, content?: string) {
    this.#lastClientId++;
    this.#handleNotification({
      id: `client_${this.#lastClientId}`,
      read: false,
      type: "client",
      severity,
      title,
      content,
      timestamp: Date.now()
    });
  }

  public markAsRead(notification: INotification): Observable<Readonly<INotification>> {
    if (notification.type === "server") {
      throw new Error("Server notifications are currently not implemented.");
    }

    const newNotification = Object.freeze({ ...notification, read: true });

    this.#notifications = Object.freeze(
      this.#notifications.map(n => n.id === newNotification.id ? newNotification : n)
    );

    this.#notificationsSub$.next(this.#notifications);
    return of(newNotification);
  }

  public deleteNotification(notification: INotification): Observable<void> {
    if (notification.type === "server") {
      throw new Error("Server notifications are currently not implemented.");
    }

    this.#notifications = Object.freeze(this.#notifications.filter(n => n !== notification));

    this.#notificationsSub$.next(this.#notifications);
    return of();
  }

  /**
   * Function freezes notification object, adds it to an array and emits values from subjects.
   * @param notification
   */
  #handleNotification(notification: INotification) {
    Object.freeze(notification);
    this.#notifications = Object.freeze([notification, ...this.#notifications]);
    this.#notificationSub$.next(notification);
    this.#notificationsSub$.next(this.#notifications);
  }
}

export interface INotification {
  id: string;
  read?: boolean;
  type: "client" | "server";
  severity: TSeverity;
  title: string;
  content?: string;
  timestamp: number;
}

export type TSeverity = "success" | "warn" | "info" | "error";
