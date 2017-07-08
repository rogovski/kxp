export interface BounceDataObject {
    y: number;
};

export interface BounceDataError {
    message: string;
};

export function Bounce_data_error(msg: string): BounceDataError {
    return { message: msg };
}