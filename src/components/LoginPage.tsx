import * as React from 'react';
import {
  validateName,
  validateNonEmpty,
  validateEmail,
  validateIBAN,
} from '../utils/validations';
import '../styles/LoginPage.css';

const removeIcon = require('../icons/icon-trash.svg');

interface LoginPageProps {}

interface BankAccount {
  iban: string;
  bankName: string;
  [key: string]: string;
}

interface BankAccountError {
  iban?: FieldError;
  bankName?: FieldError;
  [key: string]: FieldError;
}

type BankAccountErrors = BankAccountError[] | string;

type FieldError = string | null | undefined;

interface LoginPageErrors {
  firstName?: FieldError;
  lastName?: FieldError;
  email?: FieldError;
  bankAccounts: BankAccountErrors;
  [key: string]: FieldError | BankAccountErrors;
}

interface LoginPageState {
  firstName: string;
  lastName: string;
  email: string;
  bankAccounts: BankAccount[];
  errors: LoginPageErrors;
  [key: string]: string | BankAccount[] | boolean | LoginPageErrors;
}

type FormValues = Partial<LoginPageState>;

interface FormField {
  fieldName: string;
  label: string;
  placeholder: string;
}

interface FormFieldWithValue extends FormField {
  error?: FieldError;
  value: string;
}

interface Focusable<P> extends React.Component<P> {
  focus: () => void;
}

const DEFAULT_BANK_ACCOUNT: BankAccount = {
  iban: '',
  bankName: '',
};

const FormFields: FormField[] = [{
  label: 'First Name',
  fieldName: 'firstName',
  placeholder: 'John',
}, {
  label: 'Last Name',
  fieldName: 'lastName',
  placeholder: 'Doe',
}, {
  label: 'Email',
  fieldName: 'email',
  placeholder: 'john.doe@example.com',
}];

const NAME_SEPARATOR = '.';
const INDEX_BASE = 10;

export default class LoginPage extends React.Component<LoginPageProps, LoginPageState> {

  constructor(props: LoginPageProps) {
    super(props);

    this.state = {
      firstName: '',
      lastName: '',
      email: '',
      bankAccounts: [],
      errors: {
        firstName: null,
        lastName: null,
        email: null,
        bankAccounts: [],
      },
    };
  }

  onFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget;

    this.setState({
      ...this.state,
      [name]: value,
    });
  }

  onFieldBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget;

    const validations = {
      firstName: this.validateFirstName,
      lastName: this.validateLastName,
      email: this.validateEmail,
    };

    this.setState({
      errors: {
        ...this.state.errors,
        [name]: validations[name](value),
      },
    });
  }

  onBankAccountBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    this.setState({
      errors: {
        ...this.state.errors,
        bankAccounts: this.validateBankAccounts(this.state.bankAccounts),
      },
    });
  }

  onAccountCreate = () => {
    this.setState(
      { errors: this.validateData(this.state) },
      () => {
        if (this.isDataValid(this.state.errors)) {
          alert(
`Form data:
${JSON.stringify(this.extractDataFromState(this.state))}
    `);
        }
      });
  }

  onBankAccountAdd = () => {
    this.setState({
      bankAccounts: this.state.bankAccounts.concat(DEFAULT_BANK_ACCOUNT)
    });
  }

  onBankAccountEdit = (e: React.ChangeEvent<HTMLInputElement>) => {
    const [ index, fieldName ] = this.parseFieldName(e.currentTarget.name);

    this.setState({
      bankAccounts: this.state.bankAccounts.map(
        (account: BankAccount, i: number) =>
          (i === index)
            ? ({
              ...account,
              [fieldName]: e.currentTarget.value,
            })
            : account),
    });
  }

  onBankAccountRemove = (index: number) =>
    () => {
      this.setState({
        bankAccounts: this.state.bankAccounts.filter((account, i) => i !== index),
        errors: {
          ...this.state.errors,
          bankAccounts: [],
        },
      });
    }

  onBankAccountIBANMount = (ref: React.ReactInstance | null) => {
    if (ref) {
      (ref as Focusable<HTMLInputElement>).focus();
    }
  }

  generateFieldName(fieldName: string, index: number | null = null) {
    if (index === null) {
      return fieldName;
    }

    return `${index}${NAME_SEPARATOR}${fieldName}`;
  }

  parseFieldName(fieldName: string) {
    const [ index, name ] = fieldName.split(NAME_SEPARATOR);

    return [ parseInt(index, INDEX_BASE), name ];
  }

  extractDataFromState({ firstName, lastName, email, bankAccounts }: LoginPageState) {
    return { firstName, lastName, email, bankAccounts };
  }

  validateFirstName(name: string): FieldError {
    return !validateName(name) ? 'First name should contain only letters' : null;
  }

  validateLastName(name: string): FieldError {
    return !validateName(name) ? 'Last name should contain only letters' : null;
  }

  validateEmail(name: string): FieldError {
    return !validateEmail(name) ? 'Email should be valid' : null;
  }

  validateBankAccounts(bankAccounts: BankAccount[]): BankAccountErrors {
    if (!bankAccounts.length) {
      return 'You should provide at least one bank account';
    }

    return bankAccounts.map(account => ({
      iban: !validateIBAN(account.iban) ? 'IBAN is not valid' : null,
      bankName: !validateNonEmpty(account.bankName) ? 'Bank name should not be empty' : null,
    }));
  }

  validateData({ firstName, lastName, email, bankAccounts }: LoginPageState): LoginPageErrors {
    return {
      firstName: this.validateFirstName(firstName),
      lastName: this.validateLastName(lastName),
      email: this.validateEmail(email),
      bankAccounts: this.validateBankAccounts(bankAccounts),
    };
  }

  renderBankAccounts(bankAccounts: BankAccount[], errors: BankAccountErrors) {
    return bankAccounts.map((account, i) => {
      const ibanFieldName = this.generateFieldName('iban', i);
      const bankNameFieldName = this.generateFieldName('bankName', i);

      const error = {
        ...errors[i] as BankAccountError,
      };
      const ibanError = error.iban;
      const bankNameError = error.bankName;

      return (
        <div
            className="form__row form__row--vertical"
            key={i}
        >
          <div className="form__row form__row--vertical">
            <div className="form__row form__row--horizontal">
              <label
                  className="form__row__label"
                  htmlFor={ibanFieldName}
              >
                IBAN
              </label>
              <input
                  className="form__row__item"
                  type="text"
                  tabIndex={0}
                  name={ibanFieldName}
                  id={ibanFieldName}
                  value={account.iban}
                  placeholder="AL47 2121 1009 0000 0002 3569 8741"
                  onChange={this.onBankAccountEdit}
                  onBlur={this.onBankAccountBlur}
                  ref={this.onBankAccountIBANMount}
              />
              <img
                  className="form__row__icon form__row__icon--active"
                  src={removeIcon}
                  tabIndex={0}
                  onClick={this.onBankAccountRemove(i)}
              />
            </div>
            {ibanError && (
              <div className="form__row form__row--error">
                {ibanError}
              </div>
            )}
          </div>
          <div className="form__row form__row--vertical">
            <div className="form__row form__row--horizontal">
              <label
                  className="form__row__label"
                  htmlFor={bankNameFieldName}
              >
                Bank Name
              </label>
              <input
                  className="form__row__item"
                  type="input"
                  tabIndex={0}
                  name={bankNameFieldName}
                  id={bankNameFieldName}
                  value={account.bankName}
                  placeholder="Imaginary Bank Ltd."
                  onChange={this.onBankAccountEdit}
                  onBlur={this.onBankAccountBlur}
              />
            </div>
            {bankNameError && (
              <div className="form__row form__row--error">
                {bankNameError}
              </div>
            )}
          </div>
        </div>
      );
    });
  }

  renderField({ label, fieldName, value, placeholder, error }: FormFieldWithValue) {
    return (
      <div
          className="form__row form__row--vertical"
          key={fieldName}
      >
        <div className="form__row form__row--horizontal">
          <label
              className="form__row__label"
              htmlFor={fieldName}
          >
            {label}
          </label>
          <input
              className="form__row__item"
              type="text"
              tabIndex={0}
              name={fieldName}
              id={fieldName}
              value={value}
              placeholder={placeholder}
              onChange={this.onFieldChange}
              onBlur={this.onFieldBlur}
          />
        </div>
        {error && (
          <div className="form__row form__row--error">
            {error}
          </div>
        )}
      </div>
    );
  }

  renderFields(fields: FormField[], values: FormValues, errors: LoginPageErrors) {
    return fields.map(field => this.renderField({
      ...field,
      value: values[field.fieldName] as string,
      error: errors[field.fieldName] as FieldError,
    }));
  }

  isDataValid(errors: LoginPageErrors) {
    const hasError = Object
        .keys(errors)
        .filter(fieldName => fieldName !== 'bankAccounts')
        .every(fieldName => !fieldName);
    const hasBankAccountErrors =
        ((typeof errors.bankAccounts === 'string') && errors.bankAccounts)
            || ((errors.bankAccounts as BankAccountError[]).every(
                account => !!account.iban || !!account.bankName));

    return !hasError && !hasBankAccountErrors;
  }

  render() {
    const { firstName, lastName, email, bankAccounts, errors } = this.state;
    const isDataValid = this.isDataValid(errors);
    const bankAccountError = (typeof errors.bankAccounts === 'string')
        ? errors.bankAccounts
        : null;

    return (
      <div className="page page--centered">
        <div className="form">
          <h1 className="form__header">
            Register account
          </h1>
          {this.renderFields(FormFields, { firstName, lastName, email }, errors)}
          <h1 className="form__header form__header--medium">
            Bank accounts
          </h1>
          {this.renderBankAccounts(bankAccounts, errors.bankAccounts)}
          <div className="form__row form__row--vertical">
            <div className="form__row form__row--horizontal form__row--centered">
              <button
                  tabIndex={0}
                  className="form__button"
                  onClick={this.onBankAccountAdd}
              >
                <span className="form__button__icon">+</span>
                &nbsp;Add Bank Account
              </button>
            </div>
            {bankAccountError && (
              <div className="form__row form__row--error">
                {bankAccountError}
              </div>
            )}
          </div>
          <div className="form__row form__row--horizontal form__row--buttons">
            <button
                tabIndex={isDataValid ? 0 : -1}
                className={`form__button form__button--primary ${!isDataValid ? 'form__button--disabled' : ''}`}
                onClick={this.onAccountCreate}
            >
              Create Account
            </button>
          </div>
        </div>
      </div>
    );
  }
}
