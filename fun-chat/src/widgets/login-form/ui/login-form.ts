import { Component } from '@shared/component';
import { button, div, heading, img, input } from '@shared/tags';
import { AppRoutes, Router, getRouter } from '@app/router';
import about from '@assets/icons/about.svg';
import styles from './login-form.module.css';
import { checkValidLogin, checkValidPassword } from '../utils/validation';
import { authLogin } from '@/entities/user';

class LoginForm extends Component<HTMLFormElement> {
  private username: Component<HTMLInputElement> = input({
    type: 'text',
    className: styles.loginFormInput,
    name: 'Username',
    placeholder: 'Enter username',
    autocomplete: 'username',
    onInput: () => {
      if (checkValidLogin(this.username, this.nameError)) {
        this.username.removeClassName(styles.invalid);
      } else {
        this.username.addClassName(styles.invalid);
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
      div({ className: styles.loginFormInputContainer }, this.username, this.nameError),
      div({ className: styles.loginFormInputContainer }, this.password, this.surnameError),
      this.loginBtn,
      button(
        {
          className: `about-icon ${styles.aboutBtn}`,
          title: 'About Fun Chat',
          onClick: () => getRouter().navigate(AppRoutes.ABOUT),
        },
        img({ src: about, alt: 'To About', className: 'icon' })
      ),
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
    const nameErr = checkValidLogin(this.username, this.nameError);
    const surnameErr = checkValidPassword(this.password, this.surnameError);
    if (nameErr && surnameErr) {
      authLogin(this.username.getNode().value, this.password.getNode().value, () => {
        this.router.navigate(AppRoutes.HOME);
      });
    }
  }
}

export default LoginForm;
