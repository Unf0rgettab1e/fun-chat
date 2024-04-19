import { div, heading } from '@shared/tags';
import styles from './user-error.module.css';

export const error = (text: string) =>
  div({ className: styles.error }, heading({ text: 'Oops, error...' }, 2), heading({ text }, 4));
