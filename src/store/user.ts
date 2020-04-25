import { GetterTree, MutationTree, ActionTree } from 'vuex';
import authEndpoint from '@/api/auth';
import userEndpoint from '@/api/user';

export const SET_USER = 'SET_USER';
export const UNSET_USER = 'UNSET_USER';
export const USER_INFO = 'USER_INFO';

interface Identity {
  _id?: string;
  name?: string;
  surname?: string;
  patronymics?: string;
  phone?: string;
  access?: number;
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
  fullName: s => s.identity ? `${(s as any).identity?.surname} ${(s as any).identity?.name}${(s as any).identity?.patronymics && ` ${(s as any).identity?.patronymics}`}` : '',
  userData: s => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { _id, ...rest } = s.identity as any;
    return { ...rest };
  },
  hasAccess: s => (s.identity as any).access > 0
};

const mutations: MutationTree<State> = {
  [SET_USER](state, { _id, phone, name, surname, patronymics, access }) {
    const user = { _id, name, phone, surname, patronymics, access };
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
      .catch(err => err.response?.data);

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
  },

  async updateCommonInfo({ commit }, { phone, name, surname, patronymics }: {[key: string]: string}) {
    const received = await userEndpoint.put('', {
      phone,
      name,
      surname,
      patronymics
    }).catch(err => err.response?.data);
    if(received?.response?.status >= 400 && received.status >= 400) {
      throw new Error(received.response.data.message);
    }
    const userInfo = await userEndpoint.get('', {
      params: {
        phone
      }
    });
    commit(SET_USER, userInfo.data);
    return received.data;
  }
};

export default {
  namespaced: true,
  state: () => new State(),
  getters,
  mutations,
  actions
};
