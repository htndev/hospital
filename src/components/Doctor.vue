<template>
  <v-card>
    <v-img
        height="250"
        :src="getImageSrc(doctor.image)"
    ></v-img>
    <v-card-title>{{ fullName }}</v-card-title>
    <v-card-text>
      <div>{{ doctor.description }}</div>
    </v-card-text>
    <v-divider class="mx-4"></v-divider>
    <v-card-title>Специализация</v-card-title>
    <v-card-text>
      <v-chip-group column>
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
  import { DoctorItem } from '@/common/types';
  import { getImageSrc } from '@/common/dev';

  @Component({
    name: 'Doctor'
  })
  export default class Doctor extends Vue {
    @Prop({ type: Object, default: () => ({}) }) doctor!: DoctorItem;
    get fullName() {
      return `${this.doctor.surname} ${this.doctor.name} ${this.doctor.patronymics}`;
    }

    getImageSrc = getImageSrc;
  }
</script>

<style scoped lang="sass">
  .v-card__title
    word-break: break-word
</style>
