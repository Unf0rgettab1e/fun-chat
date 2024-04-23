import { getHistory } from '../api/history.api';

export const requestCurrentMsgHistory = (username: string) => {
  getHistory(username);
};
