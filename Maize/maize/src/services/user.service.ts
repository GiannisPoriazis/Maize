import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { Permission } from "src/interfaces/permission.interface";
import { User, User_Request } from "src/interfaces/user.interface";
import { UserRole, UserRolePermissions } from "src/interfaces/user.role.interface";

@Injectable({
    providedIn: 'root'
})
  
export class UserService {
    constructor(private http: HttpClient) {}

    createUser(user: User, informUserCredentials: boolean) {
        return this.http.post(environment.apiURL + `user/createUser/${informUserCredentials}`, user);
    }

    findUsers(keyword?: string) {
        if(!keyword || keyword === '')
            return this.http.get<User[]>(environment.apiURL + `user/findUsers/all`);
        
        return this.http.get<User[]>(environment.apiURL + `user/findUsers/${keyword}`);
    }

    updateUser(user: User) {
        return this.http.post(environment.apiURL + `user/updateUser/`, user);        
    }

    getUsers(req: User_Request) {
        return this.http.post<User[]>(environment.apiURL + `user/getUsers/`, req);
    }

    getUserRolePermissions() {
        return this.http.get<Permission[]>(environment.apiURL + `user/getUserRolePermissions`);
    }

    getUserRoles() {
        return this.http.get<UserRole[]>(environment.apiURL + `user/getUserRoles`);
    }

    createUserRole(userRole: UserRolePermissions) {
        return this.http.post(environment.apiURL + `user/createUserRole`, userRole); 
    }

    updateUserRole(userRole: UserRolePermissions) {
        return this.http.post(environment.apiURL + `user/updateUserRole`, userRole); 
    }

    deleteUserRole(userRoleId: number) {
        return this.http.post(environment.apiURL + `user/deleteUserRole/`, userRoleId);  
    }

    deleteUser(userId: number) {
        return this.http.post(environment.apiURL + `user/deleteUser/`, userId);  
    }

    validatePin(userId: number, pin: string) {        
        return this.http.get<any>(environment.apiURL + `user/validatePin/${userId}/${pin}`);
    }
}