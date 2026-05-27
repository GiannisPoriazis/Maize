export interface UserRole {
  id: number;
  name: string;
}

export interface UserRolePermissions {
  id: number;
  name: string;
  permissions: string[];
}