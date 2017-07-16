
export interface Sine3dDataObject {
    y: number[][]
};

export interface Sine3dDataError {
    message: string;
};

export function bounce_data_error(msg: string): Sine3dDataError {
    return { message: msg };
}
