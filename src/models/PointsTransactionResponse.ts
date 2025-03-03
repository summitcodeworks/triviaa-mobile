export interface ResponseHeader {
    responseCode: number;
    responseMessage: string;
}

export interface PointsTransaction {
    transaction_id: string;
    user_id: string;
    transaction_type: string;    // e.g., "winner", "correct_answer"
    points: number;
    description: string;
    created_at: string;          // ISO 8601 timestamp
    use_flag: boolean;
}

export interface PointsTransactionResponse {
    header: ResponseHeader;
    response: PointsTransaction[];
}
