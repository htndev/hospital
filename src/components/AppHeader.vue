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
          :name="text"
          :email="email"
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
import { mdiHospitalBuilding, mdiPencilOutline  } from '@mdi/js';
import Avatar from './Avatar.vue';
import { mapGetters } from 'vuex';

@Component({
  name: 'AppHeader',
  components: { Avatar },
  computed: {
    // @ts-ignore
    ...mapGetters(['isUserAuthenticated'])
  }
})
export default class AppHeader extends Vue {
  isUserAuthenticated!: boolean;
  logoIcon = mdiHospitalBuilding;
  bookVisitIcon = mdiPencilOutline;

  text = 'Alex Van';

  email = 'htn.developer@gmail.com';

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

  created() {
    // console.log(this);
  }
}
</script>

<style scoped lang="sass">
  .v-application
    a
      text-decoration: none
</style>
