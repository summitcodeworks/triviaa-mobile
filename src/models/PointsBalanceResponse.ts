export interface ResponseHeader {
    responseCode: number;
    responseMessage: string;
}

// Interface for the response data containing user points information
export interface UserPointsResponse {
    user_id: string;
    total_points: number;
    last_updated: string; // Keeping as string since it's ISO format from API
    use_flag: boolean;
}

// Interface for the complete API response
export interface PointsBalanceResponse {
    header: ResponseHeader;
    response: UserPointsResponse;
}
