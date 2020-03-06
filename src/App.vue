<template>
  <v-app>
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
import AppHeader from '@/components/AppHeader.vue';

@Component({
  name: 'App',
  components: { AppHeader }
})
export default class App extends Vue {

}
</script>
