import { useState } from 'react';

export interface Validator {
    type: string;
    isValid: (value: string) => boolean;
    message: string;
}

export const useValidationError = (validators: Validator[], name: string)=> {
    const [error, setError] = useState('');
    const res = validators.find((validator)=> {
        return !validator.isValid(name);
    });
    const newError = res?.message || '';
    if (error !== newError) {
        setError(newError);
    }
    return error;
}
