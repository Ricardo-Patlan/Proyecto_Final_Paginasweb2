export interface User {
  id: string;
  email: string;
  fullName: string;
  isActive: boolean;
  roles: string[];
}

// Lo que responde el backend en /auth/login, /auth/register y
// /auth/check-status. /auth/login solo manda id, email y token (no
// fullName/roles), por eso son opcionales aqui.
export interface AuthResponse {
  id: string;
  email: string;
  fullName?: string;
  isActive?: boolean;
  roles?: string[];
  token: string;
}
