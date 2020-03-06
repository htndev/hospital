import { GetterTree, MutationTree, ActionTree } from 'vuex';

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
  authorizeUser(context, payload) {
    console.log(context);
    console.log(payload);
    // TODO: Authorization
  },

  async logout(context) {
    console.log('Logout');
  }
};

export default {
  state: () => new State(),
  getters,
  mutations,
  actions
};
