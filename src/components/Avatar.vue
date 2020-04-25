<template>
  <div>
    <v-menu
      :offset-y="true"
      transition="slide-y-transition"
    >
      <template v-slot:activator="{ on: menu }">
        <v-tooltip bottom>
          <template v-slot:activator="{ on: tooltip }">
            <v-avatar
              color="red"
              v-on="{ ...tooltip, ...menu }"
            >
              <span>{{ letters }}</span>
            </v-avatar>
          </template>
          <span>{{ phone }}</span>
        </v-tooltip>
      </template>
      <v-list>
        <v-list-item>
          <v-btn
            outlined
            width="100%"
            to="/settings"
          >
            Аккаунт
          </v-btn>
        </v-list-item>
        <v-list-item v-if="hasAccess">
          <v-btn
              outlined
              width="100%"
              to="/dashboard"
          >
            Дэшборд
          </v-btn>
        </v-list-item>
        <v-list-item>
          <v-btn
            width="100%"
            outlined
            @click="logout"
          >
            Выход
          </v-btn>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator';

  @Component({
    name: 'Avatar'
  })
  export default class Avatar extends Vue {
    @Prop({ default: '' }) name?: string;
    @Prop({ default: '' }) phone?: string;

    get letters() {
      return this.getFirstLetters(this.name?.slice().split(' ') as []);
    }

    getFirstLetters(values: string[]): string {
      return `${values[0][0]}${values[1] ? values[1][0] : ''}`;
    }

    logout() {
      this.$store.dispatch('user/logout');
      this.$router.push('/auth');
    }

    get hasAccess() {
      return this.$store.getters['user/hasAccess'];
    }
  }
</script>

<style scoped lang="sass">
  .v-avatar
    cursor: pointer

  .v-list-item
    cursor: pointer
</style>
