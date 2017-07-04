export interface ExampleDataObject {
    ref: string;
    description: string | null;
    value: number;
};

export interface ExampleDataSuccess {
    objects: ExampleDataObject[]
};

export interface ExampleDataError {
    message: string;
};

export interface ExampleDataState {
    width: number | null;
    height: number | null;
    objects: ExampleDataObject[];
    is_fetching: boolean;
}

export function example_data_error(msg: string): ExampleDataError {
    return { message: msg };
}