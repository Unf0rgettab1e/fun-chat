import { div, heading } from '@shared/tags';
import styles from './auth-error.module.css';

export const error = (title: string, text: string) =>
  div({ className: styles.error }, heading({ text: title }, 2), heading({ text }, 4));
