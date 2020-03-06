import Vue, { PluginObject } from 'vue';
import user from '@/api/user';
import { Api } from '@/common/types';

const endpoints: Api = {
  user
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
