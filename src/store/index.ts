import Vue from 'vue';
import Vuex from 'vuex';
import user, { State as UserState } from '@/store/user';

Vue.use(Vuex);

interface HospitalStore {
  state: {
    user: UserState
  }
}

export default new Vuex.Store({
  strict: true,
  modules: {
    user
  }
}) as HospitalStore;
