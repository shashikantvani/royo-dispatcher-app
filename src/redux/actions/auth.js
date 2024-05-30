import {
  CANCEL_SPECIFIC_PLAN,
  GET_ALL_SUBSCRIPTION_PLANS,
  AGENT_DELETE,
  LOGIN_API,
  LOGOUT_API,
  PURCHASE_SPECIFIC_PLAN,
  SELECT_SPECIFIC_PLAN,
  SEND_OTP,
  SIGNUPDOC,
  SIGNUP_API,
  SIGNUP_SEND_OTP,
  CAB_POOLING_STATUS,
} from '../../config/urls';
import { apiGet, apiPost, removeItem, saveCabPollingStatus, setItem, setUserData } from '../../utils/utils';
import store from '../store';
import types from '../types';
const {dispatch} = store;

export const saveUserData = data => {
  dispatch({
    type: types.LOGIN,
    payload: data,
  });
};

export const removerUserData = data => {
  dispatch({
    type: types.USER_LOGOUT,
    payload: data,
  });
};

export function login(data = {}, headers = {}) {
  console.log(data, 'login>data>data>data', headers);
  return new Promise((resolve, reject) => {
    apiPost(LOGIN_API, data, headers)
      .then(async res => {
        resolve(res);
      })
      .catch(error => {
        reject(error);
      });
  });
}

export function signUp(data = {}, headers = {}) {
  console.log(data, 'login>data>data>data', headers);
  return new Promise((resolve, reject) => {
    apiPost(SIGNUP_API, data, headers)
      .then(async res => {
        resolve(res);
      })
      .catch(error => {
        reject(error);
      });
  });
}

export const updataeUserData = data => {
  setUserData(data).then(suc => {
    dispatch({
      type: types.UPDATEUSER,
      payload: data,
    });
  });
};

export function verifyAccount(data = {}, headers = {}) {
  console.log(data, 'verifyAccount>data>data>data');

//
  return new Promise((resolve, reject) => {
    // setUserData({name:'shashikant',access_token:"22332",client_preference:{is_cab_pooling_toggle:true,custom_mode:JSON.stringify({})}}).then(suc => {
    //   saveUserData({name:'shashikant',access_token:"22332",client_preference:{is_cab_pooling_toggle:true,custom_mode:JSON.stringify({})}});
    //   resolve({data:{name:'shashikant',access_token:"22332",client_preference:{is_cab_pooling_toggle:true,custom_mode:JSON.stringify({})}}});
    // });
    apiPost(SEND_OTP, data, headers)
      .then(async res => {
        setUserData(res.data).then(suc => {
          saveUserData(res.data);
          resolve(res);
        });
      })
      .catch(error => {
        reject(error);
      });
  });
}

//logout

export function logout(data = {}, headers = {}) {
  return new Promise((resolve, reject) => {
    apiGet(LOGOUT_API, data, headers)
      .then(async res => {
        await removeItem('userData');
        removerUserData();
        resolve(res);
      })
      .catch(error => {
        reject(error);
      });
  });
}

//Get Signup documents

export function signupDoc(data = {}, headers = {}) {
  return new Promise((resolve, reject) => {
    apiPost(SIGNUPDOC, data, headers)
      .then(async res => {
        resolve(res);
      })
      .catch(error => {
        reject(error);
      });
  });
}

//get all subscriptions
export function getAllSubscriptions(data = {}, headers = {}) {
  return new Promise((resolve, reject) => {
    apiGet(GET_ALL_SUBSCRIPTION_PLANS, data, headers)
      .then(res => {
        resolve(res);
      })
      .catch(error => {
        reject(error);
      });
  });
}

//Select specific subscription
export function selectSpecificSubscriptionPlan(
  query = '',
  data = {},
  headers = {},
) {
  console.log(SELECT_SPECIFIC_PLAN + query, 'apiIsThis ');
  return new Promise((resolve, reject) => {
    apiGet(SELECT_SPECIFIC_PLAN + query, data, headers)
      .then(res => {
        resolve(res);
      })
      .catch(error => {
        console.log(error, 'errrrrrSELECT_SPECIFIC_PLAN');
        reject(error);
      });
  });
}

//Purchase subscription plan
export function purchaseSubscriptionPlan(query = '', data = {}, headers = {}) {
  return new Promise((resolve, reject) => {
    apiPost(PURCHASE_SPECIFIC_PLAN + query, data, headers)
      .then(res => {
        resolve(res);
      })
      .catch(error => {
        reject(error);
      });
  });
}

//Cancel subscription plan
export function cancelSubscriptionPlan(query = '', data = {}, headers = {}) {
  return new Promise((resolve, reject) => {
    apiPost(CANCEL_SPECIFIC_PLAN + query, data, headers)
      .then(res => {
        resolve(res);
      })
      .catch(error => {
        reject(error);
      });
  });
}
export function deleteAccount(data = {}, headers = {}) {
  console.log(data, headers, 'data>>>>>>');
  return new Promise((resolve, reject) => {
    apiPost(AGENT_DELETE, data, headers)
      .then(async res => {
        resolve(res);
      })
      .catch(error => {
        reject(error);
      });
  });
}

export function sendOtpOnSignup(data = {}, headers = {}) {
  return new Promise((resolve, reject) => {
    apiPost(SIGNUP_SEND_OTP, data, headers)
      .then(async res => {
        resolve(res);
      })
      .catch(error => {
        reject(error);
      });
  });
}

export function updateCabPoolingStatus(data = {}, headers = {}) {
  console.log(headers, data, "headers,dataheaders,data");
  return new Promise((resolve, reject) => {
    apiPost(CAB_POOLING_STATUS, data, headers)
      .then(async res => {
        resolve(res)
      }
      )
      .catch(error => {
        reject(error);
      });
  });
}







