import { Badge } from "@shared/ui/badge";
import { getRequestStatusOption } from "@entities/request/lib/status";
import type { RequestStatus } from "@entities/request/model/types";

export function RequestStatusBadge({ status }: { status: RequestStatus }) {
  const option = getRequestStatusOption(status);
  return <Badge tone={option.tone}>{option.label}</Badge>;
}
