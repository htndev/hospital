<template>
  <v-card>
    <v-img
        height="250"
        :src="doctor.image"
    ></v-img>
    <v-card-title>{{ fullName }}</v-card-title>
    <v-card-text>
      <div>{{ doctor.description }}</div>
    </v-card-text>
    <v-divider class="mx-4"></v-divider>
    <v-card-title>Специализация</v-card-title>
    <v-card-text>
      <v-chip-group>
        <v-chip
            outlined
            color="blue"
            v-for="(spec, i) in doctor.specialities"
            :key="i"
        >
          {{ spec.title }}
        </v-chip>
      </v-chip-group>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
  import { Component, Vue, Prop } from 'vue-property-decorator';
  import { DEFAULT_DOCTOR_IMAGE } from '@/common/constants';

  export interface DoctorItem {
    name: string;
    surname: string;
    patronymics: string;
    description: string;
    specialities: {id: number; title: string}[];
    image: string;
  }

  @Component({
    name: 'Doctor'
  })
  export default class Doctor extends Vue {
    // @Prop({ type: String, default: '' }) name!: string;
    // @Prop({ type: String, default: '' }) surname!: string;
    // @Prop({ type: String, default: '' }) patronymics!: string;
    // @Prop({ type: String, default: '' }) description!: string;
    // @Prop({ type: String, default: DEFAULT_DOCTOR_IMAGE }) image!: string;
    // @Prop({ type: Array, default: [] }) specialities!: {id: number; title: string}[];
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    @Prop({type: Object, default: () => {} }) doctor!: DoctorItem;
    get fullName() {
      return `${this.doctor.surname} ${this.doctor.name} ${this.doctor.patronymics}`;
    }
  }
</script>

<style scoped>

</style>
