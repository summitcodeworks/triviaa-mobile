export interface ResponseHeader {
    responseCode: number;
    responseMessage: string;
}

export interface PopularCategory {
    category_id: number;
    category_name: string;
    play_count: number;
    last_played: string;  // ISO 8601 timestamp
    name: string;
    icon: string;
    color: string;        // Hex color code
    description: string;
}

export interface PopularCategoriesResponse {
    header: ResponseHeader;
    response: PopularCategory[];
}
