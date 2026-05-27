import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { ActiveModule, Module } from "src/interfaces/module.interface";

@Injectable({
    providedIn: 'root'
})
  
export class ModuleService {
    constructor(private http: HttpClient) {}

    getModules() {
        return this.http.get<Module[]>(environment.apiURL + `module/getModules/`);
    }

    getActiveModules() {
        return this.http.get<ActiveModule[]>(environment.apiURL + `module/getActiveModules/`);
    }

    activateModule(req: ActiveModule) {
        return this.http.post(environment.apiURL + `module/activateModule/`, req);
    }

    deactivateModule(req: number) {
        return this.http.post(environment.apiURL + `module/deactivateModule/`, req);
    }
}