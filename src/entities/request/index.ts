export type { RequestStatus, RequestSummary, RequestDetail, RequestComment, RequestHistoryEntry, RequestDocument } from "@entities/request/model/types";
export { MOCK_REQUESTS, getMockRequestById } from "@entities/request/model/mock";
export { REQUEST_STATUS_OPTIONS, getRequestStatusOption } from "@entities/request/lib/status";
export { RequestStatusBadge } from "@entities/request/ui/RequestStatusBadge";
