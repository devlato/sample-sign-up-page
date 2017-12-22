import * as iban from 'iban';

export const validateEmail = (value: string = '') =>
    /^[a-z0-9\._\-]+\@[a-z0-9\._\-]+\.[a-z0-9_\-]{2,}$/ig.test(value);

export const validateName = (value: string = '') =>
    /^[a-z]+$/ig.test(value);

export const validateNonEmpty = (value: string = '') =>
    (typeof value === 'string') && (value.trim() !== '');

export const validateIBAN = (value: string = '') =>
    iban.isValid(value);
