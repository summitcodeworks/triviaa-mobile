export class UserData {
    private _user_id: string;
    private _user_key: string;
    private _user_name: string;
    private _user_email: string;
    private _user_credits: number | null;
    private _user_creation_date: string;
    private _use_flag: boolean;
    private _user_photo_url: string;
    private _device_token: string;
    private _phone_number: string;
    private _username: string;

    constructor(jsonData?: any) {
        this._user_id = '';
        this._user_key = '';
        this._user_name = '';
        this._user_email = '';
        this._user_credits = null;
        this._user_creation_date = '';
        this._use_flag = false;
        this._user_photo_url = '';
        this._device_token = '';
        this._phone_number = '';
        this._username = '';

        if (jsonData) {
            this.fromJSON(jsonData);
        }
    }

    // Method to set properties from JSON
    fromJSON(jsonData: any): void {
        this._user_id = jsonData.user_id || '';
        this._user_key = jsonData.user_key || '';
        this._user_name = jsonData.user_name || '';
        this._user_email = jsonData.user_email || '';
        this._user_credits = jsonData.user_credits || null;
        this._user_creation_date = jsonData.user_creation_date || '';
        this._use_flag = jsonData.use_flag || false;
        this._user_photo_url = jsonData.user_photo_url || '';
        this._device_token = jsonData.device_token || '';
        this._phone_number = jsonData.phone_number || '';
        this._username = jsonData.username || '';
    }

    // Method to convert class to JSON
    toJSON(): object {
        return {
            user_id: this._user_id,
            user_key: this._user_key,
            user_name: this._user_name,
            user_email: this._user_email,
            user_credits: this._user_credits,
            user_creation_date: this._user_creation_date,
            use_flag: this._use_flag,
            user_photo_url: this._user_photo_url,
            device_token: this._device_token,
            phone_number: this._phone_number,
            username: this._username
        };
    }

    // User ID
    get user_id(): string {
        return this._user_id;
    }
    set user_id(value: string) {
        this._user_id = value;
    }

    // User Key
    get user_key(): string {
        return this._user_key;
    }
    set user_key(value: string) {
        this._user_key = value;
    }

    // User Name
    get user_name(): string {
        return this._user_name;
    }
    set user_name(value: string) {
        this._user_name = value;
    }

    // User Email
    get user_email(): string {
        return this._user_email;
    }
    set user_email(value: string) {
        this._user_email = value;
    }

    // User Credits
    get user_credits(): number | null {
        return this._user_credits;
    }
    set user_credits(value: number | null) {
        this._user_credits = value;
    }

    // User Creation Date
    get user_creation_date(): string {
        return this._user_creation_date;
    }
    set user_creation_date(value: string) {
        this._user_creation_date = value;
    }

    // Use Flag
    get use_flag(): boolean {
        return this._use_flag;
    }
    set use_flag(value: boolean) {
        this._use_flag = value;
    }

    // User Photo URL
    get user_photo_url(): string {
        return this._user_photo_url;
    }
    set user_photo_url(value: string) {
        this._user_photo_url = value;
    }

    // Device Token
    get device_token(): string {
        return this._device_token;
    }
    set device_token(value: string) {
        this._device_token = value;
    }

    // Phone Number
    get phone_number(): string {
        return this._phone_number;
    }
    set phone_number(value: string) {
        this._phone_number = value;
    }

    // Username
    get username(): string {
        return this._username;
    }
    set username(value: string) {
        this._username = value;
    }
}
