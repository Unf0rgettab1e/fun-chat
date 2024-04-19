import { Component } from '@shared/component';
import { button, div, img } from '@shared/tags';
import close from '@shared/assets/icons/close.svg';
import styles from './modal.module.css';

class Modal extends Component<HTMLDivElement> {
  private window = div({ className: styles.modalWindow });

  constructor() {
    super({ className: `${styles.modalWrapper}` });
    this.node.addEventListener('click', this.clickHandler);
  }

  private close = () => {
    this.destroy();
  };

  private clickHandler = (e: Event) => {
    if (e.target === this.node) {
      e.preventDefault();
      this.close();
    }
  };

  open(content: Component) {
    this.window.destroyChildren();
    this.window.appendChild(content);
    this.render();
  }

  render() {
    this.window.appendChild(button({ className: styles.modalClose, onClick: this.close }, img({ src: close })));
    this.appendChild(this.window);
    document.body.append(this.node);
  }
}

const modal = new Modal();
export default modal;
