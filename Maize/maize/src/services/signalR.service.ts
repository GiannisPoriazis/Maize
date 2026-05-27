import { Injectable } from '@angular/core';
import { HttpTransportType, HubConnection, HubConnectionBuilder } from '@aspnet/signalr';
import { Subject } from 'rxjs';

import { environment } from '../environments/environment';
import { NotificationService } from './notification.service';
import { NotificationType, SignalRAction } from 'src/refData/ref-data';

@Injectable({
    providedIn: 'root'
})
export class SignalRService {
    private hubConnection?: HubConnection;
    public receivedAction: Subject<{action: SignalRAction, issuer: number | null}>  = new Subject<{action: SignalRAction, issuer: number | null}>()

    constructor(private notificationService: NotificationService) { }

    public startConnection = () => {
        this.hubConnection = new HubConnectionBuilder()
            .withUrl(environment.apiURL + 'broadcasting_hub', {
                skipNegotiation: true,
                transport: HttpTransportType.WebSockets
            })
            .build();
    
        this.hubConnection.start()
            .then(() => {
                console.log('Connection started');
            })
            .catch(error => {
                console.log(error);
                this.receivedAction.next({
                    action: SignalRAction.ConnectionFailed,
                    issuer: null
                });
            });
    
        this.hubConnection.on('ReceiveAction', (action, userId) => {
            this.receivedAction.next({
                action: action,
                issuer: userId
            });
        });
    }

    public stopConnection = () => {
        if(this.hubConnection !== undefined) {
            this.hubConnection.stop();
            console.log('Connection closed');
        }
    }
    
    public sendAction = (action: SignalRAction, userId: number) => {
        this.hubConnection!.invoke('SendAction', action, userId)
            .catch(error => {
                if(action === SignalRAction.AdminSettingsUpdated)
                    return;

                console.log(error);
                this.notificationService.renderTemplate(NotificationType.Error, "Broadcast failed");
            });
    }
}