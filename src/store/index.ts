import Vue from 'vue';
import Vuex from 'vuex';
import user, { State as UserState } from '@/store/user';
import specialities from '@/store/specialities';

Vue.use(Vuex);

export default new Vuex.Store({
  strict: true,
  modules: {
    user,
    specialities
  }
});
