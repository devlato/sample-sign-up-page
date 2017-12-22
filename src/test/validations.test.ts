import {
  validateIBAN,
  validateEmail,
  validateName,
  validateNonEmpty,
} from '../utils/validations';

describe('validateIBAN', () => {
  it('Should work without params', () => {
    expect.assertions(1);

    const value = undefined;
    expect(validateIBAN(value)).toEqual(false);
  });

  it('Should work for non-IBAN string', () => {
    expect.assertions(1);

    const value = 'not-iban';
    expect(validateIBAN(value)).toEqual(false);
  });

  it('Should work for IBAN string', () => {
    expect.assertions(1);

    const value = 'AL47 2121 1009 0000 0002 3569 8741';
    expect(validateIBAN(value)).toEqual(true);
  });
});

describe('validateEmail', () => {
  it('Should work without params', () => {
    expect.assertions(1);

    const value = undefined;
    expect(validateEmail(value)).toEqual(false);
  });

  it('Should work for non-email string', () => {
    expect.assertions(1);

    const value = 'non-email';
    expect(validateEmail(value)).toEqual(false);
  });

  it('Should work for email string', () => {
    expect.assertions(1);

    const value = 'hello@example.com';
    expect(validateEmail(value)).toEqual(true);
  });
});

describe('validateName', () => {
  it('Should work without params', () => {
    expect.assertions(1);

    const value = undefined;
    expect(validateName(value)).toEqual(false);
  });

  it('Should work for non-name string', () => {
    expect.assertions(1);

    const value = 'non_a+name';
    expect(validateName(value)).toEqual(false);
  });

  it('Should work for name string', () => {
    expect.assertions(1);

    const value = 'Hello';
    expect(validateName(value)).toEqual(true);
  });
});

describe('validateNonEmpty', () => {
  it('Should work without params', () => {
    expect.assertions(1);

    const value = undefined;
    expect(validateNonEmpty(value)).toEqual(false);
  });

  it('Should work for empty string', () => {
    expect.assertions(1);

    const value = '';
    expect(validateNonEmpty(value)).toEqual(false);
  });

  it('Should work for non-empty string', () => {
    expect.assertions(1);

    const value = 'non-empty';
    expect(validateNonEmpty(value)).toEqual(true);
  });
});
