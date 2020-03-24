import Vue, { PluginObject } from 'vue';
import * as _ from 'lodash';

const Plugin: PluginObject<any> = {
	install: (Vue: Vue | any) => {
		Vue.prototype.$_ = _;
	}
};

declare module 'vue/types/vue' {
	interface Vue {
		$_: _.LoDashStatic;
	}
}

Vue.use(Plugin);
