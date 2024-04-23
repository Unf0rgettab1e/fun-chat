import { User } from '@shared/api';
import {
  getActiveUsers,
  getInactiveUsers,
  onUsersLogin,
  onUsersLogout,
  setActiveUsers,
  setInactiveUsers,
} from '../api/all-users.api';
import { getUser } from './user-auth';

let allUsers: User[] = [];
let requestUsersCalls = 0;

export const getAllUsers = () => allUsers;
export const resetUsers = () => {
  allUsers = [];
};

const excludeCurUser = (user: User) => user.login !== getUser().username;

export const requestAllUsers = (renderCallback: (users: User[]) => void) => {
  if (requestUsersCalls > 0) {
    renderCallback(allUsers);
    return;
  }
  requestUsersCalls += 1;
  getActiveUsers();
  getInactiveUsers();

  setActiveUsers((users) => {
    const activeUsers = users.filter(excludeCurUser);
    allUsers.push(...activeUsers);
    renderCallback(activeUsers);
  });
  setInactiveUsers((users) => {
    const inactiveUsers = users.filter(excludeCurUser);
    allUsers.push(...inactiveUsers);
    renderCallback(inactiveUsers);
  });
};

export const onUpdateUsers = (renderCallback: (user: User, isNew?: boolean) => void) => {
  onUsersLogin((user) => {
    if (!allUsers.some((u) => u.login === user.login)) {
      allUsers.push(user);
      renderCallback(user, true);
    } else {
      const updateUser = allUsers.find((u) => u.login === user.login);
      if (updateUser) {
        updateUser.isLogined = true;
      }
      renderCallback(user, false);
    }
  });
  onUsersLogout((user) => {
    const updateUser = allUsers.find((u) => u.login === user.login);
    if (updateUser) {
      updateUser.isLogined = false;
    }
    renderCallback(user);
  });
};
