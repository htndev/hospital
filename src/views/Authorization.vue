<template>
  <div>
    <v-tabs centered>
      <v-tab to="/auth/register">Регистрация</v-tab>
      <v-tab to="/auth/login">Вход</v-tab>
    </v-tabs>
    <router-view/>
  </div>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator';

  @Component({
    name: 'Authorization'
  })
  export default class Authorization extends Vue {

  }
</script>

<style scoped>

</style>
