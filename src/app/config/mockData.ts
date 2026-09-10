import type { HeaderUser } from "@widgets/header";
import type { PermissionScope } from "@features/permissions-consent";

/** Utilizador de demonstração — troca por `entities/user` + o teu provedor de auth (MSAL/NextAuth) real. */
export const CURRENT_USER: HeaderUser = {
  name: "Ângela Amaro",
  email: "angela.amaro.ar6@gmail.com",
  role: "Administradora",
};

export const MOCK_PERMISSION_SCOPES: PermissionScope[] = [
  { group: "Identidade Básica", label: "Iniciar sessão", description: "Iniciar sessão com a tua conta Microsoft", status: "granted" },
  { group: "Identidade Básica", label: "Ver perfil", description: "Ver o teu nome e fotografia de perfil", status: "granted" },
  { group: "Microsoft Graph", label: "Ler perfil completo", description: "Ler o teu perfil completo via Microsoft Graph", status: "granted" },
  { group: "SharePoint", label: "Ler dados do site", description: "Ler pedidos, notificações e registos", status: "required" },
  { group: "SharePoint", label: "Escrever dados do site", description: "Criar e actualizar pedidos e registos", status: "required" },
];
