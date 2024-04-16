import { isNotNullable } from './utils/asserts';

export type BaseProps<T extends HTMLElement = HTMLElement> = {
  tag?: keyof HTMLElementTagNameMap | keyof SVGElementTagNameMap;
  text?: string;
} & Partial<Omit<T, 'tagName' | 'classList' | 'textContent'>>;

export type TChild = Component | HTMLElement | SVGSVGElement;

export class Component<T extends HTMLElement = HTMLElement> {
  protected node: T;

  protected children;

  constructor(props: BaseProps, ...children: (TChild | null)[]) {
    const { tag = 'div', text = '' } = props;

    const node = document.createElement(tag) as T;
    Object.assign(node, props);
    node.textContent = text;

    this.node = node;
    this.children = new Array<Component>();

    if (children) {
      this.appendChildren(children);
    }
  }

  appendChild(child: TChild) {
    if (child instanceof Component) {
      this.node.append(child.getNode());
      this.children.push(child);
    } else {
      this.node.append(child);
    }
  }

  appendChildren(children: (TChild | null)[]) {
    children.filter(isNotNullable).forEach((child) => this.appendChild(child));
  }

  getNode() {
    return this.node;
  }

  getChildren() {
    return this.children;
  }

  removeLastChild() {
    if (this.node.lastChild) {
      this.node.removeChild(this.node.lastChild);
      this.children.pop();
    }
  }

  destroy() {
    this.destroyChildren();
    this.node.remove();
  }

  destroyChildren() {
    this.children.forEach((child) => child.destroy());
    this.children = [];
  }

  setText(text: string) {
    this.node.textContent = text;
  }

  addClassName(className: string) {
    this.node.classList.add(className);
  }

  removeClassName(className: string) {
    this.node.classList.remove(className);
  }

  toggleClassName(className: string) {
    this.node.classList.toggle(className);
  }

  hasClassName(className: string) {
    return this.node.classList.contains(className);
  }

  setAttribute(name: string, value: string) {
    this.node.setAttribute(name, value);
  }

  removeAttribute(name: string) {
    this.node.removeAttribute(name);
  }

  getAttribute(name: string) {
    return this.node.getAttribute(name);
  }

  hasAttribute(name: string) {
    return this.node.hasAttribute(name);
  }

  setStyle(name: string, value: string) {
    this.node.style.setProperty(name, value);
  }

  removeStyle(name: string) {
    this.node.style.removeProperty(name);
  }

  hasStyle(name: string) {
    return this.node.style.getPropertyValue(name) !== '';
  }

  getStyle(name: string) {
    return this.node.style.getPropertyValue(name);
  }
}
