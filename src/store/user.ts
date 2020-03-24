import { GetterTree, MutationTree, ActionTree } from 'vuex';
import authEndpoint from '@/api/auth';

export const SET_USER = 'SET_USER';
export const UNSET_USER = 'UNSET_USER';
export const USER_INFO = 'USER_INFO';

interface Identity {
  _id?: string;
  name?: string;
  surname?: string;
  patronymics?: string;
  gender?: string;
  phone?: string;
}

export class State {
  constructor(
    public identity?: Identity | unknown
  ) {
    const _identity = localStorage.getItem(USER_INFO);
    if(_identity) {
      this.identity = JSON.parse(_identity);
    }
  }
}

const getters: GetterTree<State, any> = {
  isUserAuthenticated: (s: State) => !!s.identity,
  fullName: s => `${(s as any).identity.surname} ${(s as any).identity.name}${(s as any).identity.patronymics && ` ${(s as any).identity.patronymics}`}`
};

const mutations: MutationTree<State> = {
  [SET_USER](state, { _id, phone, name, surname, patronymics, gender }) {
    const user = { _id, name, phone, surname, patronymics, gender };
    state.identity = { ...user };
    localStorage.setItem('USER_INFO', JSON.stringify(user));
  },
  [UNSET_USER](state) {
    state.identity = null;
    localStorage.removeItem(USER_INFO);
  }
};

const actions: ActionTree<State, any> = {
  async isUserExists(context, { phone }) {
    await authEndpoint.get('exists', {
      params: {
        phone
      }
    });
  },

  async authorizeUser({ commit }, { phone, password }) {
    const received = await authEndpoint
      .post('/login', {
        phone,
        password
      })
      .then(response => response.data)
      .catch(err => {
        return err.response?.data;
      });

    if(received.statusCode >= 400) {
      throw new Error(received.message);
    }

    commit(SET_USER, received.payload);
  },

  async register({ dispatch }, {
    phone,
    name,
    surname,
    patronymics,
    password,
    passwordConfirmation
  }) {
    const received = await authEndpoint.post('/new', {
      phone,
      name,
      surname,
      patronymics,
      password,
      passwordConfirmation
    }).catch(err => err);
    if(received?.response?.status >= 400 && received.status >= 400) {
      throw new Error(received.response.data.message);
    }
    dispatch('authorizeUser', {
      phone,
      password
    });
  },

  async logout({ commit }) {
    commit(UNSET_USER);
  }
};

export default {
  namespaced: true,
  state: () => new State(),
  getters,
  mutations,
  actions
};
