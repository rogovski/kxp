import { ExampleDataObject, ExampleDataSuccess, ExampleDataError } from '../types/example';

export function fetch_data(
    success: (exd: ExampleDataSuccess) => void, 
    failure: (err: ExampleDataError) => void) {

        setTimeout(function() {
            success({ 
                objects: [ 
                    { ref: '123', description: null, value: 0 },
                    { ref: '633', description: 'foo', value: 2 },
                    { ref: '394', description: 'bar', value: 5 },
                    { ref: '128', description: null, value: 1 },
                    { ref: '190', description: null, value: 2 }
                ] 
            });
        }, 1000);
}