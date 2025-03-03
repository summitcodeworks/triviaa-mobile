export interface ResponseHeader {
    responseCode: number;
    responseMessage: string;
}

export interface GameSession {
    session_id: string;
    user_id: string;
    category: string;
    category_name: string;
    start_time: string;
    end_time: string;
    correct_answers: number;
    total_questions: number;
    icon: string;
    color: string;
    description: string;
}

export interface RecentGamesResponse {
    header: ResponseHeader;
    response: GameSession[];
}
