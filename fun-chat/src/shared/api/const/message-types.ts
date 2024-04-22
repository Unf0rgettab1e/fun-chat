export enum UserMessageType {
  LOGIN = 'USER_LOGIN',
  EXTERNAL_LOGIN = 'USER_EXTERNAL_LOGIN',
  LOGOUT = 'USER_LOGOUT',
  EXTERNAL_LOGOUT = 'USER_EXTERNAL_LOGOUT',
}

export enum AllUsersMessageType {
  USER_ACTIVE = 'USER_ACTIVE',
  USER_INACTIVE = 'USER_INACTIVE',
}

export enum ChatingMessageType {
  MSG_SEND = 'MSG_SEND',
  MSG_FROM_USER = 'MSG_FROM_USER',
}

export enum StatusMessageType {
  MSG_DELIVER = 'MSG_DELIVER',
  MSG_READ = 'MSG_READ',
  MSG_DELETE = 'MSG_DELETE',
  MSG_EDIT = 'MSG_EDIT',
}

export enum ErrorType {
  ERROR = 'ERROR',
}
