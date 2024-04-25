import { Component } from '@shared/component';
import styles from './context-menu.module.css';

export default class ContextMenu extends Component<HTMLDivElement> {
  private menuItems: Component<HTMLLIElement>[] = [];

  constructor(list: Component<HTMLLIElement>[]) {
    super({
      className: `${styles.contextMenu}`,
    });

    this.menuItems = list;
    this.render();
  }

  render() {
    this.appendChild(
      new Component<HTMLUListElement>({ tag: 'ul', className: styles.contextMenuList }, ...this.menuItems)
    );
    document.body.append(this.node);
  }
}
