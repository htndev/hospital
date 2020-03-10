<template>
  <v-card
      class="mr-5 mb-5"
      max-width="320"
  >
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
    <v-img
        height="250"
        :src="serviceImage"
    ></v-img>

    <v-card-title>{{ serviceTitle }}</v-card-title>

    <v-card-text>
      <div>{{ serviceDescription }}</div>
    </v-card-text>

    <v-divider class="mx-4"></v-divider>

    <v-card-title>Доктора</v-card-title>
    <v-card-text>
      <v-chip-group>
        <v-chip
            outlined
            color="blue"
            v-for="(doctor, i) in doctors"
            :key="i"
        >
          <v-avatar left>
            <v-img :src="doctor.image"/>
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
  import { mapGetters } from 'vuex';
  import { DEFAULT_DOCTOR_IMAGE } from '@/common/constants';

  export interface Doctor {
    name: string;
    image: string;
  }
  @Component({
    name: 'Service',
    computed: {
      ...mapGetters(['isUserAuthenticated'])
    }
  })
  export default class Service extends Vue {
    @Prop({ type: String, default: '' }) serviceTitle?: string;
    @Prop({ type: String, default: '' }) serviceDescription?: string;
    @Prop({ type: String, default: DEFAULT_DOCTOR_IMAGE }) serviceImage?: string;
    @Prop({ type: Array, default: () => [] }) doctors?: Doctor[];
    isUserAuthenticated!: boolean;
    modalError = false;
    modalTextError = 'Чтобы записаться, сперва зарегиструйтесь.';

    book () {
      this.modalError = true;
    }
  }
</script>

<style scoped>

</style>
