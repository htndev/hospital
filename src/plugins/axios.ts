import Vue, { PluginObject } from 'vue';
import axios, { AxiosRequestConfig } from 'axios';
import store from '@/store';

// Full config:  https://github.com/axios/axios#request-config

const config: AxiosRequestConfig = {
  // baseURL: process.env.baseURL || process.env.apiUrl || ""
  // timeout: 60 * 1000, // Timeout
  // withCredentials: true, // Check cross-site Access-Control
};

const _axios = axios.create(config);

_axios.interceptors.request.use(
  cfg => {
    cfg.headers = {
      Authorization: store.state.user.token
    };
    return cfg;
  },
  err => {
    return Promise.reject(err);
  }
);

_axios.interceptors.response.use(
  res => {
    return res;
  },
  err => {
    return Promise.reject(err);
  }
);



const Plugin: PluginObject<any> = {
  install: Vue => {
    Vue.$axios = _axios;
  }
};
Plugin.install = Vue => {
  Vue.$axios = _axios;
  window.axios = _axios;
  Object.defineProperties(Vue.prototype, {
    $axios: {
      get() {
        return _axios;
      }
    }
  });
};

Vue.use(Plugin);
