// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { VNode, VueConstructor } from 'vue';
import { AxiosInstance } from 'axios';

declare module '*.vue' {
  // eslint-disable-next-line no-duplicate-imports
  import Vue from 'vue';
  export default Vue;
}

declare global {
  interface Window {
    axios: AxiosInstance;
  }
}

declare module 'vue/types/vue' {
  interface Vue {
    $axios: AxiosInstance;
  }
  interface VueConstructor {
    $axios: AxiosInstance;
  }
}

declare global {
  namespace JSX {
    // tslint:disable no-empty-interface
    interface Element extends VNode {}
    // tslint:disable no-empty-interface
    interface ElementClass extends Vue {}
    interface IntrinsicElements {
      [elem: string]: any;
    }
  }
}
