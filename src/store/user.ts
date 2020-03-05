export class State {
  constructor(
    public id?: string,
    public name?: string,
    public token?: string
  ) {}
}

const getters = {};

const mutations = {};

const actions = {};

export default {
  state: () => new State(),
  getters,
  mutations,
  actions
};
