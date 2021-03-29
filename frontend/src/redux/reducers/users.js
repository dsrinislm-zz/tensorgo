import {
  CURRENT_USER,
  QUERY_USERS,
  QUERY_IN_PROGRESS,
} from '../constants/action-types';

const initialState = {
  current_user: null,
  users: [],
  query_in_progress:false
};

const pushToArray = (arr, obj)=>{
  const index = arr.findIndex((e) => e.id === obj.id);
  if (index === -1) {
      arr.push(obj);
  } else {
      arr[index] = obj;
  }
  return arr;
}

export default function (state = initialState, action) {
  switch (action.type) {
    case CURRENT_USER: {
      return {
        ...state,
        current_user: action.payload,
      };
    }
    case QUERY_USERS: {
      const users = action.payload.updateUser ? pushToArray(
        state.users.map(value => Object.assign({}, value)),
        action.payload.updateUser,
      ) : action.payload.users;
      return {
        ...state,
        users: users,
      };
    }
    case QUERY_IN_PROGRESS: {
      return {
        ...state,
        query_in_progress: action.payload,
      };
    }
    default:
      return state;
  }
}
