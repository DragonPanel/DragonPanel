import { Injectable } from '@angular/core';

export interface INotificationMessage {
  title: string;
  content: string;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor() { }

  info(message: INotificationMessage) {}
  success(message: INotificationMessage) {}
  warn(message: INotificationMessage) {}
  error(message: INotificationMessage) {}
}
