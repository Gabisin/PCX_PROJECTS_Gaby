export interface HeaderUser {
  name: string;
  email?: string;
  /** Rótulo curto por baixo do nome (ex.: "Administrador", cargo, departamento). */
  role?: string;
  avatarUrl?: string;
}
