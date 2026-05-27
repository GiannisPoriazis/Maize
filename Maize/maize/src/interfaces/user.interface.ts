export interface User {
  id: number;
  username: string;
  password: string;
  email: string;
  first_name: string;
  last_name: string;
  role: number;
  token: string;
  company_announcement_id?: number;
}

export interface User_Request {
  id?: number;
  username?: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  role?: number;
  company_announcement_id?: number;
}

export interface AuthenticateUserRequest {
  username: string;
  password: string;
}
