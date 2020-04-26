<template>
  <div>
    <h1>Врачи</h1>
    <template v-if="doctorsLoading">
    <div class="text-center">
      <v-progress-circular indeterminate color="primary" />
    </div>
    </template>
    <template v-else>
      <template v-if="doctors.length">
        <v-row no-gutters justify="center">
          <v-col
            cols="3"
            v-for="(doctor, i) in doctors"
            :key="i"
            class="mr-3 mb-3"
          >
            <doctor :doctor="doctor" />
          </v-col>
        </v-row>
      </template>
      <h3 v-else>Увы, врачей не найдено.</h3>
    </template>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
// @ts-ignore
import Doctor from '@/components/Doctor.vue';
import { DoctorItem } from '@/common/types';

@Component({
  name: 'Doctors',
  components: { Doctor }
})
export default class Doctors extends Vue {
  doctors: DoctorItem[] = [];
  doctorsLoading = false;
  async created() {
    this.doctorsLoading = true;
    const doctorsRequest = await this.$api.doctor.get('');
    if (doctorsRequest.status >= 400) {
      return;
    }
    this.doctors = doctorsRequest.data;
    this.doctorsLoading = false;
  }
}
</script>

<style scoped></style>
