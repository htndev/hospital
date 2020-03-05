import Vue from 'vue';
import App from './App.vue';
import router from './router';
import {Store} from 'vuex';
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
