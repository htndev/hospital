<template>
  <v-card class="mr-5 mb-5">
    <v-dialog
      v-model="modalError"
      width="400"
    >
      <v-card>
        <v-card-title class="headline">Ошибка</v-card-title>
        <v-card-text>{{ modalTextError }}</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
              color="green darken-1"
              text
              @click="modalError = false"
          >
            Закрыть
          </v-btn>

          <v-btn
              color="green darken-1"
              text
              to="/auth/register"
          >
            Зарегистрироваться
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-card-title>{{ serviceTitle }}</v-card-title>

    <v-divider class="mx-4"></v-divider>

    <v-card-title>Доктора</v-card-title>
    <v-card-text>
      <v-chip-group
        column
      >
        <v-chip
            outlined
            color="blue"
            v-for="(doctor, i) in doctors"
            :key="i"
        >
          <v-avatar left>
            <v-img :src="getImageSrc(doctor.image)"/>
          </v-avatar>
          {{ doctor.name }}
        </v-chip>
      </v-chip-group>
    </v-card-text>
    <v-card-actions>
      <v-btn
          color="deep-purple lighten-2"
          text
          @click="book"
      >
        Записаться
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
  import { Component, Vue, Prop } from 'vue-property-decorator';
  import { getImageSrc } from '@/common/dev';

  export interface Doctor {
    name: string;
    surname?: string;
    patronymics?: string;
    image: string;
  }
  @Component({
    name: 'Service'
  })
  export default class Service extends Vue {
    @Prop({ type: String, default: '' }) serviceTitle?: string;
    @Prop({ type: String, default: '' }) serviceId?: string;
    @Prop({ type: Array, default: () => [] }) doctors?: Doctor[];
    modalError = false;
    modalTextError = 'Чтобы записаться, сперва зарегиструйтесь.';

    getImageSrc = getImageSrc;

    async book () {
      this.modalError = true;
    }

    get isUserAuthenticated(): boolean {
      return this.$store.getters['isUserAuthenticated'];
    }
  }
</script>

<style scoped>

</style>
