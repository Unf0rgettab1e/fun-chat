import { Component } from '@shared/component';
import { div, heading, input } from '@shared/tags';
import { AppRoutes, Router, getRouter } from '@app/router';
import styles from './login-form.module.css';
import { checkValidLogin, checkValidPassword } from '../utils/validation';
import { storeUserData } from '../utils/storage';

class LoginForm extends Component<HTMLFormElement> {
  private login: Component<HTMLInputElement> = input({
    type: 'text',
    className: styles.loginFormInput,
    name: 'Login',
    placeholder: 'Enter username',
    autocomplete: 'username',
    onInput: () => {
      if (checkValidLogin(this.login, this.nameError)) {
        this.login.removeClassName(styles.invalid);
      } else {
        this.login.addClassName(styles.invalid);
      }
    },
  });

  private password: Component<HTMLInputElement> = input({
    type: 'password',
    className: styles.loginFormInput,
    name: 'Password',
    placeholder: 'Enter password',
    autocomplete: 'current-password',
    onInput: () => {
      if (checkValidPassword(this.password, this.surnameError)) {
        this.password.removeClassName(styles.invalid);
      } else {
        this.password.addClassName(styles.invalid);
      }
    },
  });

  private loginBtn: Component<HTMLInputElement> = input({
    className: styles.loginFormSubmit,
    type: 'submit',
    value: 'Login',
  });

  private nameError = div({
    className: styles.loginFormInputError,
  });

  private surnameError = div({
    className: styles.loginFormInputError,
  });

  private router: Router = getRouter();

  constructor() {
    super({
      tag: 'form',
      className: styles.loginForm,
    });

    this.render();
  }

  render() {
    this.appendChildren([
      heading({ text: 'Login here', className: styles.loginFormTitle }, 1),
      div({ className: styles.loginFormInputContainer }, this.login, this.nameError),
      div({ className: styles.loginFormInputContainer }, this.password, this.surnameError),
      this.loginBtn,
    ]);
    this.setSubmitHandler(this.submitHandler.bind(this));
  }

  setSubmitHandler(handler: () => void) {
    this.getNode().addEventListener('submit', (e) => {
      e.preventDefault();
      handler();
    });
  }

  submitHandler() {
    const nameErr = checkValidLogin(this.login, this.nameError);
    const surnameErr = checkValidPassword(this.password, this.surnameError);
    if (nameErr && surnameErr) {
      this.router.navigate(AppRoutes.HOME);
      storeUserData({
        login: this.login.getNode().value,
        password: this.password.getNode().value,
      });
    }
  }
}

export default LoginForm;
