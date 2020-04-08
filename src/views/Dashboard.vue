<template>
  <div>
    <h1>Главная панель</h1>
    <h3 class="my-4">Здесь производитсья менеджмент врачами, записями, пользователями.</h3>
    <dashboards/>
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';
  // @ts-ignore
  import Dashboards from '@/components/Dashboard/Dashboards.vue';

  @Component({
    name: 'Dashboard',
    components: { Dashboards }
  })
  export default class Dashboard extends Vue {

  }
</script>

<style scoped>

</style>
