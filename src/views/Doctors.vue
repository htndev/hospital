<template>
  <div>
    <h1>Врачи</h1>
    <template v-if="doctors.length">
      <v-col
        cols="4"
        v-for="(doctor, i) in doctors"
        :key="i"
      >
        <doctor
            :doctor="doctor"
        />
      </v-col>
    </template>
    <h3 v-else>Увы, врачей не найдено.</h3>
  </div>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator';
  // @ts-ignore
  import Doctor, { DoctorItem } from '@/components/Doctor.vue';

  @Component({
    name: 'Doctors',
    components: { Doctor }
  })
  export default class Doctors extends Vue {
    doctors: DoctorItem[] = [
      {
        name: 'Александр',
        surname: 'Ванильчук',
        patronymics: 'Владимирович',
        description: 'Это врач, и все.',
        specialities: [
          {
            id: 1,
            title: 'Офтольмолог'
          }
        ]
      }
    ];
  }
</script>

<style scoped>

</style>
