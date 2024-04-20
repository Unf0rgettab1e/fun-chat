import rss from '@assets/icons/RSS.svg';
import { Component } from '@shared/component';
import { div, a, img } from '@shared/tags';
import styles from './footer.module.css';

export default class Footer extends Component<HTMLDivElement> {
  constructor() {
    super({
      tag: 'footer',
      className: styles.footer,
    });
    this.render();
  }

  render() {
    this.appendChildren([
      div(
        { className: styles.footerText, text: '© 2024 Made with ❤️ by' },
        a(
          { href: 'https://github.com/Unf0rgettab1e', className: styles.footerGithub, title: 'Unf0rgettab1e' },
          img({ src: 'https://github.com/Unf0rgettab1e.png', alt: 'Unf0rgettab1e', className: styles.footerGithubImg })
        )
      ),
      a(
        { href: 'https://rs.school/', className: styles.footerLink },
        img({ src: rss, alt: 'RS School', className: styles.footerLinkImg })
      ),
    ]);
  }
}
