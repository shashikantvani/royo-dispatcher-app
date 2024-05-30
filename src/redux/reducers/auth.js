import types from '../types';

const initial_state = {
  userData: {},
  profileAddress:{}, 
 
};

export default function (state = initial_state, action) {
  switch (action.type) {
    case types.LOGIN: {
      const data = action.payload;
      return {userData: data};
    }

    case types.UPDATEUSER: {
      const data = action.payload;
      return {userData: data};
    }

    case types.USER_LOGOUT: {
      const data = action.payload;
      return {userData: undefined};
    }
 

    default: {
      return {...state};
    }
  }
}
