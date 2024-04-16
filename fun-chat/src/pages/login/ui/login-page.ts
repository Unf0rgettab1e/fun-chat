import { Component } from '@shared/component';
import { LoginForm } from '@widgets/login-form';
import styles from './login-page.module.css';

class LoginPage extends Component {
  constructor() {
    super({
      className: styles.loginPage,
    });

    this.render();
  }

  render() {
    this.appendChild(new LoginForm());
  }
}

export default LoginPage;
