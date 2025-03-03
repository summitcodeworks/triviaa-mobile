export interface ResponseHeader {
    responseCode: number;
    responseMessage: string;
}

export interface UserCoinsResponse {
    coin_id: string;
    user_id: string;
    coin_balance: number;
    last_updated: string;
    use_flag: boolean;
}

export interface CoinsBalanceResponse {
    header: ResponseHeader;
    response: UserCoinsResponse;
}
