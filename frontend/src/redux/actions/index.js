import {
  CURRENT_USER,
  QUERY_USERS,
  QUERY_IN_PROGRESS,
} from '../constants/action-types';

export const setCurrentUser = (payload) => ({
  type: CURRENT_USER,
  payload,
});
export const setQueryUsers = (payload) => ({
  type: QUERY_USERS,
  payload,
});
export const setQueryInProgress = (payload) => ({
  type: QUERY_IN_PROGRESS,
  payload,
});
