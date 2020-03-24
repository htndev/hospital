import Vue, { PluginObject } from 'vue';
import auth from '@/api/auth';
import { Api } from '@/common/types';

const endpoints: Api = {
  auth
};

const Plugin: PluginObject<any> = {
  install: (Vue: Vue | any) => {
    Vue.prototype.$api = { ...endpoints };
  }
};

declare module 'vue/types/vue' {
  interface Vue {
    $api: Api;
  }
}

Vue.use(Plugin);
