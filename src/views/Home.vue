<template>
  <div>
    <v-row no-gutters>
      <img src="@/assets/images/hospital.jpg" alt="Hospital" class="home-page-image"/>
    </v-row>
    <h1 class="text-center">Добро пожаловать в "Доктор Плюс"!</h1>
    <h3 class="text-center">Чтобы записатсья на прием, авторизируйтесь на сайте!</h3>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

@Component({
  name: 'Home'
})
export default class Home extends Vue {}
</script>
<style lang="sass" scoped>
  .home-page-image
    display: block
    width: 100%
</style>
