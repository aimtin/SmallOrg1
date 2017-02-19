export interface IOrganisations {
    key: string;
    orgName: string;
    address: string;
    email: string;
    status: string;
    user: IUser;
}

export interface IProducts {
    key: string;
    productName: string;
    brand: string;
    description: string;
    qty: number;
    rate: number;
    amount: number;
    subject: string;
    orgName: string;
    user: IUser;
}

export interface UserCredentials {
    email: string;
    password: string;
}

export interface IUser {
    uid: string;
    username: string;
}

export interface Predicate<T> {
    (item: T): boolean;
}

export interface ValidationResult {
    [key: string]: boolean;
}