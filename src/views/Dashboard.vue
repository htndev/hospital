<template>
  <div>
    <h1>Главная панель</h1>
    <h3>Здесь производитсья управления врачами, записями, пользователями.</h3>
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';

  @Component({
    name: 'Dashboard'
  })
  export default class Dashboard extends Vue {

  }
</script>

<style scoped>

</style>
