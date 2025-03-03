export interface ResponseHeader {
    responseCode: number;
    responseMessage: string;
}

export interface CoinsTransaction {
    transaction_id: string;
    user_id: string;
    transaction_type: string;        // e.g., "credit"
    transaction_amount: number;
    transaction_date: string;        // ISO 8601 timestamp
    transaction_reference: string;
    comment: string;
}

export interface CoinsTransactionResponse {
    header: ResponseHeader;
    response: CoinsTransaction[];
}
