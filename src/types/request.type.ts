export interface Request {
    id: string;
    userId: string;
    userName?: string;
    userEmail?: string;
    roleRequested: "provider" | "admin";
    reason: string;
    status: "pending" | "approved" | "rejected";
    submittedAt: Date;
    reviewedAt?: Date;
    reviewerId?: string;
}

export interface CreateRequestDto {
    userId: string;
    roleRequested: "provider" | "admin";
    reason: string;
}