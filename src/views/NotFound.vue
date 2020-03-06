<template>
  <div>
    <p>404. Страница совсем не найдена.</p>
    <router-link to="/">На главную</router-link>
  </div>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator';

  @Component({
    name: 'NotFound'
  })
  export default class NotFound extends Vue {

  }
</script>

<style scoped>

</style>
