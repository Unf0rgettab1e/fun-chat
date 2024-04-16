import { Component } from '@shared/component';

const MIN_LOGIN_LENGTH = 3;
const MIN_PASSWORD_LENGTH = 8;

const isValidLogin = (value: string) => {
  const pattern = new RegExp(`^[A-ZА-Я][a-zA-Zа-яА-Я0-9-_]{${MIN_LOGIN_LENGTH},}$`);
  return pattern.test(value);
};

export const checkValidLogin = (targetField: Component<HTMLInputElement>, errorField: Component) => {
  const value = targetField.getNode().value.trim();
  const fieldName = targetField.getNode().name;
  if (value === '') {
    errorField.setText(`${fieldName} is required`);
  } else if (value[0] !== value[0].toUpperCase() || !/[A-ZА-Я]/.test(value[0])) {
    errorField.setText(`${fieldName} must begin with a capital letter`);
  } else if (value.length < MIN_LOGIN_LENGTH) {
    errorField.setText(`At least ${MIN_LOGIN_LENGTH} letters`);
  } else if (!isValidLogin(value)) {
    errorField.setText('Letters, numbers, hyphen "-" and "_" only');
  } else {
    errorField.setText('');
  }
  return errorField.getNode().textContent === '';
};

const isValidPassword = (value: string) => {
  const pattern = /^(?=.*[A-ZА-Я])(?=.*\d)(?=.*[!@#$%^&*]).+$/;
  return pattern.test(value);
};

export const checkValidPassword = (targetField: Component<HTMLInputElement>, errorField: Component) => {
  const value = targetField.getNode().value.trim();
  const fieldName = targetField.getNode().name;
  if (value === '') {
    errorField.setText(`${fieldName} is required`);
  } else if (!isValidPassword(value)) {
    errorField.setText(`At least one capital letter, one number and one special character(!@#$%^&*)`);
  } else if (value.length < MIN_PASSWORD_LENGTH) {
    errorField.setText(`At least ${MIN_PASSWORD_LENGTH} letters`);
  } else {
    errorField.setText('');
  }
  return errorField.getNode().textContent === '';
};
