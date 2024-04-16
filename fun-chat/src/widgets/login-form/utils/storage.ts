export const storeUserData = (userData: { login: string; password: string }) => {
  sessionStorage.setItem('userData', JSON.stringify(userData));
};
