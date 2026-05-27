import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { Client, Client_Request } from "src/interfaces/client.interface";
import { LineChartData } from "src/interfaces/line.chart.data.interface";

@Injectable({
    providedIn: 'root'
})
  
export class ClientService {
    constructor(private http: HttpClient) {}

    createClient(client: Client) {
        return this.http.post<number>(environment.apiURL + `client/createClient/`, client);
    }

    getClients(req: Client_Request) {
        return this.http.post<Client[]>(environment.apiURL + `client/getClients/`, req);
    }

    findClients(keyword?: string) {
        if(!keyword || keyword === '')
            return this.http.get<Client[]>(environment.apiURL + `client/findClients/all`);
        
        return this.http.get<Client[]>(environment.apiURL + `client/findClients/${keyword}`);
    }

    updateClient(client: Client) {
        return this.http.put(environment.apiURL + `client/updateClient/`, client);        
    }

    deleteClient(clientId: number) {
        return this.http.post(environment.apiURL + `client/deleteClient/`, clientId);  
    }

    getClientsLineChartData() {
        return this.http.get<LineChartData>(environment.apiURL + `client/getClientsLineChartData/`);
    }
}