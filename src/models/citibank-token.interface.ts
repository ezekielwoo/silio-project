export interface CitibankToken {
    access_token: string;
    refresh_token: string;
    scope: string;
    token_type: string;
    expires_in: number;
    date_created: Date;
}