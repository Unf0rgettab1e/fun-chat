import { Component } from '@shared/component';
import styles from './loader.module.css';

export default class Loader extends Component<HTMLSpanElement> {
  constructor() {
    super({ className: styles.loader });
  }
}
