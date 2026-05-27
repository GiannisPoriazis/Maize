import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { CompanyAnnouncement, CompanyAnnouncement_Request, UpdateUserAnnouncements } from "src/interfaces/company.announcement.interface";

@Injectable({
    providedIn: 'root'
})
  
export class CompanyAnnouncementService {
    constructor(private http: HttpClient) {}

    getAnnouncements(req: CompanyAnnouncement_Request) {
        return this.http.post<CompanyAnnouncement[]>(environment.apiURL + `companyAnnouncement/getAnnouncements/`, req);
    }

    createAnnouncement(announcement: CompanyAnnouncement) {
        return this.http.post(environment.apiURL + `companyAnnouncement/createAnnouncement/`, announcement);
    }

    updateAnnouncement(announcement: CompanyAnnouncement) {
        return this.http.put(environment.apiURL + `companyAnnouncement/updateAnnouncement/`, announcement);        
    }

    deleteAnnouncement(announcementId: number) {
        return this.http.post(environment.apiURL + `companyAnnouncement/deleteAnnouncement/`, announcementId);  
    }

    getUserAnnouncements(req: number) {
        return this.http.post<CompanyAnnouncement[]>(environment.apiURL + `companyAnnouncement/getUserAnnouncements/`, req);
    }

    readUserAnnouncement(req: UpdateUserAnnouncements) {
        return this.http.post<number>(environment.apiURL + `companyAnnouncement/readUserAnnouncement/`, req); 
    }
}