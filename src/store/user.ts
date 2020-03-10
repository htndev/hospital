import { GetterTree, MutationTree, ActionTree } from 'vuex';
import endpoint from '@/api/user';

export class State {
  constructor(
    public id?: string,
    public name?: string,
    public token?: string
  ) {}
}

const getters: GetterTree<State, any> = {
  isUserAuthenticated: (s: State) => !!s.token
};

const mutations: MutationTree<State> = {};

const actions: ActionTree<State, any> = {
  async isUserExists(context, {email}) {
    await endpoint.get('exists', {
      params: {
        email
      }
    });
  },

  authorizeUser(context, { email, password }) {
    console.log(context);
    console.log({email, password});
    // TODO: Authorization
  },

  async logout(context) {
    console.log('Logout');
  }
};

export default {
  namespaced: true,
  state: () => new State(),
  getters,
  mutations,
  actions
};
