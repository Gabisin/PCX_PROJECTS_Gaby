export type RequestStatus =
  | "draft"
  | "submitted"
  | "in_review"
  | "awaiting_info"
  | "approved"
  | "completed"
  | "rejected"
  | "cancelled";

export interface RequestComment {
  id: string;
  authorName: string;
  message: string;
  createdAt: string;
}

export interface RequestHistoryEntry {
  id: string;
  fromStatus?: RequestStatus;
  toStatus: RequestStatus;
  actorName: string;
  comment?: string;
  createdAt: string;
}

export interface RequestDocument {
  id: string;
  name: string;
  sizeLabel: string;
  uploadedAt: string;
}

export interface RequestSummary {
  id: string;
  number: string;
  title: string;
  description?: string;
  type: string;
  status: RequestStatus;
  requesterName: string;
  requesterEmail?: string;
  department?: string;
  submittedAt: string;
  documentsCount: number;
  commentsCount: number;
}

export interface RequestDetail extends RequestSummary {
  businessJustification?: string;
  documents: RequestDocument[];
  comments: RequestComment[];
  history: RequestHistoryEntry[];
}
