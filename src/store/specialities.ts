import { GetterTree, MutationTree, ActionTree } from 'vuex';
import specialitiesEndpoint from '@/api/specialities';

export const SET_SPECIALITIES = 'SET_SPECIALITIES';

export interface Speciality {
	uuid: string;
	title: string;
	specialities: object;
}

class State {
	specialities: Speciality[] = [];
}

const getters: GetterTree<State, any> = {
	specialities: s => [ ...s.specialities ]
};

const mutations: MutationTree<State> = {
	[SET_SPECIALITIES](state, specialities) {
		state.specialities = [ ...specialities ].sort((a, b) => a - b);
	}
};

const actions: ActionTree<State, any> = {
	async fetchSpecialities({ commit }) {
		const specs = await specialitiesEndpoint.get('', {
			params: {
				doctorsRequired: 'amount'
			}
		});
		commit(SET_SPECIALITIES, specs.data);
	}
};

export default {
	namespaced: true,
	state: () => new State(),
	getters,
	mutations,
	actions
};
