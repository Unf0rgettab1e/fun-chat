import { Component } from '@shared/component';
import { button, div, heading, img } from '@shared/tags';
import { authLogout, getUser } from '@entities/user';
import { AppRoutes } from '@app/router/const';
import { getRouter } from '@app/router';
import logout from '@assets/icons/logout.svg';
import avatarIcon from '@assets/icons/user-circle.svg';
import about from '@assets/icons/about.svg';
import styles from './header.module.css';

export default class Header extends Component<HTMLDivElement> {
  constructor() {
    super({ tag: 'header', className: styles.header });

    this.render();
  }

  render() {
    this.appendChildren([
      heading(
        { text: 'Fun Chat', className: styles.headerTitle },
        1,
        button(
          {
            className: 'about-icon',
            title: 'About Fun Chat',
            onClick: () => getRouter().navigate(AppRoutes.ABOUT),
          },
          img({ src: about, alt: 'To About', className: 'icon' })
        )
      ),
      div(
        { className: styles.headerLogout, text: getUser().username },
        img({ src: avatarIcon, alt: 'Ava', className: styles.headerAvatar }),
        button(
          {
            className: styles.headerButton,
            title: 'Logout',
            onClick: () => {
              authLogout(() => getRouter().navigate(AppRoutes.LOGIN));
            },
          },
          img({ src: logout, alt: 'Logout', className: styles.headerLogoutIcon })
        )
      ),
    ]);
  }
}
