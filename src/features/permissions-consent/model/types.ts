export type PermissionStatus = "granted" | "required" | "unknown";

export interface PermissionScope {
  group: string;
  label: string;
  description: string;
  status: PermissionStatus;
}
