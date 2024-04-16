import { BaseProps, Component } from './component';

type TagProps<T extends HTMLElement = HTMLElement> = Omit<BaseProps<T>, 'tag'>;

export const div = (props: TagProps<HTMLDivElement>, ...children: (Component | HTMLElement | SVGSVGElement | null)[]) =>
  new Component<HTMLDivElement>({ tag: 'div', ...props }, ...children);

export const span = (props: TagProps<HTMLSpanElement>, ...children: (Component | HTMLElement | null)[]) =>
  new Component<HTMLSpanElement>({ tag: 'span', ...props }, ...children);

export const heading = (
  props: TagProps<HTMLHeadingElement>,
  level: 1 | 2 | 3 | 4 | 5 | 6,
  ...children: (Component | HTMLElement | null)[]
) => new Component<HTMLHeadingElement>({ tag: `h${level}`, ...props }, ...children);

export const img = (props: TagProps<HTMLImageElement>) => new Component<HTMLImageElement>({ tag: 'img', ...props });

export const a = (props: TagProps<HTMLAnchorElement>, ...children: (Component | HTMLElement | null)[]) =>
  new Component<HTMLAnchorElement>({ tag: 'a', ...props }, ...children);
export const input = (props: TagProps<HTMLInputElement> & { onInput?: () => void }) =>
  new Component<HTMLInputElement>({
    tag: 'input',
    ...props,
    oninput(ev: Event) {
      ev.preventDefault();
      props.onInput?.();
    },
  });

export const label = (props: TagProps<HTMLLabelElement>) => new Component<HTMLLabelElement>({ tag: 'label', ...props });

export const button = (props: TagProps<HTMLButtonElement> & { onClick: () => void }, ...children: Component[]) =>
  new Component<HTMLButtonElement>(
    {
      tag: 'button',
      ...props,
      onclick(event: Event) {
        event.preventDefault();
        props.onClick();
      },
    },
    ...children
  );

export const svgSprite = (href: string) => {
  const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
  use.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', href);
  const svgElem = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svgElem.appendChild(use);
  return svgElem;
};
