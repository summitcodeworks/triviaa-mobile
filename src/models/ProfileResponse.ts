export interface CategoryStats {
    category_id: number;
    category_name: string;
    category_icon: string;
    category_color: string;
    total_quizzes_played: number;
    total_wins: number;
    total_losses: number;
    total_answers: number;
    total_correct_answers: number;
    total_incorrect_answers: number;
    accuracy: number; // Could use string if API returns "100.00" consistently, but number aligns with typical usage
}

export interface ProfileData {
    user_id: string;
    user_name: string;
    user_email: string;
    user_photo_url: string;
    total_points: number;
    points_last_updated: string; // ISO date string (e.g., "2025-02-22T10:02:58.277Z")
    total_quizzes_played: string; // API returns string, could be number if parsed
    total_wins: string; // API returns string, could be number if parsed
    total_losses: string; // API returns string, could be number if parsed
    total_answers: string; // API returns string, could be number if parsed
    total_correct_answers: string; // API returns string, could be number if parsed
    total_incorrect_answers: string; // API returns string, could be number if parsed
    accuracy: string; // "100.00" as string, could be number if parsed
    category_stats: CategoryStats[];
    reports: any[]; // Empty in sample, define further if reports have a structure
}

export interface ProfileResponse {
    header: {
        responseCode: number;
        responseMessage: string;
    };
    response: ProfileData;
}
