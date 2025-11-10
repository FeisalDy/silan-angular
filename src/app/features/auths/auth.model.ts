export interface Auth {}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface User {
  id: string;
  username: string;
  email: string;
  avatar_url: string;
  bio: string;
  status: string;
  permissions: Permissions;
  created_at: string;
  updated_at: string;
}

type PermissionAction = 'create' | 'list' | 'read' | 'update' | 'delete';
export interface Permissions {
  chapter?: PermissionAction[];
  chapter_translation?: PermissionAction[];
  novel?: PermissionAction[];
  novel_translation?: PermissionAction[];
  translation_job?: PermissionAction[];
  user?: PermissionAction[];
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  token: string;
  user: User;
}
