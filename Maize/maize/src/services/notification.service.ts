import { Injectable, ViewContainerRef } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

import { NotificationComponent } from '../app/notification/notification.component';
import { AudioPreloaderService } from './audio.preloader.service';
import { NotificationType } from '../refData/ref-data';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  public isLoading = new BehaviorSubject<boolean>(false);

  private notificationContainer: ViewContainerRef | undefined;

  constructor(private audioPreloaderService: AudioPreloaderService) { }

  setContainer(container: ViewContainerRef) {
    this.notificationContainer = container;
  }

  renderTemplate(type: NotificationType, message: string, audio: number = 1) {
    if (this.notificationContainer === undefined)
    {
      return;
    }

    // Render instance of NotificationComponent
    const componentRef = this.notificationContainer.createComponent(NotificationComponent, { index: 0 });
    let audioFile: string | undefined;

    switch (type) {
      case NotificationType.Success:
        componentRef.instance.alertBackgroundColor = 'bg-green-500';
        componentRef.instance.alertMessage = `${componentRef.instance.successIcon} <p class="notification-message">${message}</p>`;
        audioFile = 'success-sound.wav';
        break;
      case NotificationType.Info:
        componentRef.instance.alertBackgroundColor = 'bg-blue-500';
        componentRef.instance.alertMessage = `${componentRef.instance.infoIcon} <p class="notification-message">${message}</p>`;
        audioFile = 'info-sound.wav';
        break;
      case NotificationType.Warning:
        componentRef.instance.alertBackgroundColor = 'bg-yellow-500';
        componentRef.instance.alertMessage = `${componentRef.instance.warningIcon} <p class="notification-message">${message}</p>`;
        audioFile = 'warning-sound.wav';
        break;
      case NotificationType.Error:
        componentRef.instance.alertBackgroundColor = 'bg-red-500';
        componentRef.instance.alertMessage = `${componentRef.instance.dangerIcon} <p class="notification-message">${message}</p>`;
        audioFile = 'error-sound.wav';
        break;
    }

    if (audio && audioFile != undefined) {
      const audio: HTMLAudioElement | undefined = this.audioPreloaderService.getAudio(audioFile);

      if (audio != undefined) {
        audio.play();
      }
    }

    const element: HTMLElement | null = componentRef.location.nativeElement;

    if (element) {
      element.addEventListener('animationend', () => {
        componentRef.destroy();
      });

      const closeElementButton: HTMLElement | null = element.querySelector(".close-notification");

      if (closeElementButton != null) {
        closeElementButton.addEventListener('click', () => {
          componentRef.destroy();
        });
      }
    }

    return componentRef;
  }

  showError(error: HttpErrorResponse, audio: number = 1) {
    if (this.isDefaultError(error)) {
      this.renderTemplate(NotificationType.Error, error.statusText, audio);
    }
  }

  isDefaultError(error: HttpErrorResponse): boolean {
    if (error.status !== 401 && error.status !== 500) {
      return true;
    }

    return false;
  }

  setLoader(loading: boolean): void {
    this.isLoading.next(loading);
  }
}
