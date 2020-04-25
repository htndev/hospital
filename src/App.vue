<template>
  <v-app>
    <v-alert
        border="left"
        elevation="2"
        v-model="showError"
        transition="slide-x-reverse-transition"
        :type="alertType"
    >
      {{ errorText }}
    </v-alert>
    <app-header/>
    <v-content>
      <transition >
        <v-container>
          <keep-alive>
            <router-view></router-view>
          </keep-alive>
        </v-container>
      </transition>
    </v-content>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
// @ts-ignore
import AppHeader from '@/components/AppHeader.vue';

import eventBus from '@/common/eventBus';

@Component({
  name: 'App',
  components: { AppHeader }
})
export default class App extends Vue {
  showError = false;
  errorText = '';
  TIMEOUT_DELAY = 3000;
  alertType = 'success';

  created() {
    eventBus.$on('show:alert', (message: string, props: any) => {
      this.toggleAlert(message, { ...props });
    });
  }

  toggleAlert(text = 'Что-то пошло не так. Извините.', { type }: any) {
    this.showError = true;
    this.errorText = text;
    this.alertType = type;
    setTimeout(() => {
      this.showError = false;
    }, this.TIMEOUT_DELAY);
  }
}
</script>
<style lang="sass" scoped>
  .v-alert
    position: fixed
    top: 5rem
    right: 1rem
    z-index: 1
</style>
