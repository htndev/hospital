<template>
  <v-app-bar app color="primary" dark>
    <router-link
      class="text--white mr-3"
      to="/"
    >
      <v-icon>{{ logoIcon }}</v-icon>
    </router-link>
    <router-link
        v-for="link in links"
        :key="link.title"
        :to="link.to"
        class="white--text mr-3"
        exact-active-class="active-link"
        exact
    >
      {{link.title}}
    </router-link>

    <v-spacer></v-spacer>
    <template v-if="isUserAuthenticated">
      <v-btn
          depressed
          rounded
          class="mr-3"
          color="success"
      >
        <v-icon left>{{ bookVisitIcon }}</v-icon>
        Записаться
      </v-btn>
      <avatar
          :name="fullname"
          :phone="userInfo.phone"
          v-if="isUserAuthenticated"
      />
    </template>
    <v-btn
        to="/auth"
        v-else
        color="red darken-3"
    >
      Авторизироваться
    </v-btn>
  </v-app-bar>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { mdiHospitalBuilding, mdiPencilOutline } from '@mdi/js';
// @ts-ignore
import Avatar from './Avatar.vue';

@Component({
  name: 'AppHeader',
  components: { Avatar }
})
export default class AppHeader extends Vue {
  logoIcon = mdiHospitalBuilding;
  bookVisitIcon = mdiPencilOutline;

  get fullname() {
    return this.$store.getters['user/fullName'];
  }

  get userInfo() {
    return this.$store.state.user.identity;
  }

  get isUserAuthenticated() {
    return this.$store.getters['user/isUserAuthenticated'];
  }

  links = [
    {
      title: 'Врачи',
      to: '/doctors'
    },
    {
      title: 'Услуги',
      to: '/services'
    },
    {
      title: 'Про нас',
      to: '/about'
    }
  ];
}
</script>

<style scoped lang="sass">
  .v-application
    a
      text-decoration: none
</style>
