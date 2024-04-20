import { Component } from '@shared/component';
import { button, div, heading, img, p } from '@shared/tags';
import returnIcon from '@assets/icons/return.svg';
import { AppRoutes, getRouter } from '@app/router';
import { getUser } from '@entities/user';
import styles from './about-page.module.css';

export default class AboutPage extends Component {
  constructor() {
    super({ className: styles.about });
    this.render();
  }

  render() {
    this.appendChild(
      div(
        { className: styles.aboutContent },
        button(
          {
            className: styles.aboutReturn,
            title: 'Go back',
            type: 'button',
            onClick: () => {
              if (getUser().isLoggedIn) {
                getRouter().navigate(AppRoutes.HOME);
              } else {
                getRouter().navigate(AppRoutes.LOGIN);
              }
            },
          },
          img({ src: returnIcon, alt: 'Return', className: styles.aboutReturnIcon })
        ),
        new Component({ tag: 'header' }, heading({ text: 'About Fun Chat', className: styles.aboutTitle }, 1)),
        new Component(
          {
            tag: 'section',
            className: `${styles.aboutFeatures} ${styles.section}`,
          },
          heading({ text: 'Features', className: styles.aboutFeaturesTitle }, 3),
          new Component(
            {
              tag: 'ul',
              className: styles.aboutFeaturesList,
            },
            new Component({ tag: 'li', className: styles.aboutFeaturesItem, text: 'Real-time chat' }),
            new Component({ tag: 'li', className: styles.aboutFeaturesItem, text: 'Simple and intuitive interface' }),
            new Component({ tag: 'li', className: styles.aboutFeaturesItem, text: 'Text chat only for now...' }),
            new Component({ tag: 'li', className: styles.aboutFeaturesItem, text: 'No ads!' }),
            new Component({ tag: 'li', className: styles.aboutFeaturesItem, text: "That's all for now 😎" })
          )
        ),
        new Component(
          {
            tag: 'section',
            className: `${styles.aboutAuthor} ${styles.section}`,
          },
          heading({ text: 'About me', className: styles.aboutAuthorTitle }, 3),
          p({
            text: 'I am Web Developer from Minsk, Belarus. I love coding and learning new things',
            className: styles.aboutAuthorText,
          }),
          heading({ text: 'P.S: Fun Chat server developed by MikAleinik' }, 5)
        )
      )
    );
  }
}
