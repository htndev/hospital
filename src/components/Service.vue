<template>
  <v-card class="mr-5 mb-5">
    <v-card-title>{{ service.title }}</v-card-title>

    <v-divider class="mx-4"></v-divider>

    <v-card-title>Доктора</v-card-title>
    <v-card-text>
      <v-chip-group
        column
      >
        <v-chip
            outlined
            color="blue"
            v-for="(doctor, i) in service.doctors"
            :key="i"
        >
          <v-avatar left>
            <v-img :src="getImageSrc(doctor.image)"/>
          </v-avatar>
          {{ getInitials(doctor) }}
        </v-chip>
      </v-chip-group>
    </v-card-text>
    <v-card-actions>
      <v-spacer/>
      <v-btn
          color="deep-purple lighten-2"
          text
          @click="callModal"
      >
        Записаться
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
  import { Component, Vue, Prop } from 'vue-property-decorator';
  import { getImageSrc, getInitials } from '@/common/dev';
  import { DoctorItem } from '@/common/types';

  interface IService {
    doctors: DoctorItem[];
    title: string;
    uid: string;
  }
  @Component({
    name: 'Service'
  })
  export default class Service extends Vue {
    @Prop({ type: Object, default: () => ({}) }) service?: IService;

    getImageSrc = getImageSrc;
    getInitials = getInitials;

    callModal() {
      this.$emit('book-modal', this.service);
    }

  }
</script>

<style scoped>

</style>
