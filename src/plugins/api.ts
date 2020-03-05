import Vue, {PluginObject} from 'vue';
import userEndpoint from '@/api/user';

const endpoints = [userEndpoint];

const Plugin: PluginObject<any> = {
  install: (Vue: any) => {
    console.log('installed');
    console.log(Vue.prototype);
    console.log(endpoints);
    Vue.prototype.$api = {
      hi: 'Hi!'
    };
  }
};

declare module 'vue/types/vue' {
  interface Vue {
    $api: any;
  }
}

Vue.use(Plugin);
