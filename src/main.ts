import Vue from 'vue';
import { Store } from 'vuex';
// @ts-ignore
import App from './App';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';
import './plugins/axios';
import './plugins/api';

Vue.config.productionTip = false;

new Vue({
  router,
  store: store as Store<any>,
  vuetify,
  render: h => h(App)
}).$mount('#app');
