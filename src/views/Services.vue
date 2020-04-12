<template>
  <div>
    <h1 class="mb-5">Наши услуги</h1>
    <v-col
        cols="5"
        v-if="!servicesLoading"
    >
      <v-text-field
          v-model="searchText"
          label="Поиск услуги"
          outlined
          :prepend-inner-icon="searchIcon"
      />
    </v-col>
      <v-skeleton-loader
          :loading="servicesLoading"
          width="340"
          type="card"
      >
        <v-row
            no-gutters
        >
        <template v-if="matchedServices.length">
          <v-col
              cols="4"
              v-for="(service) in matchedServices"
              :key="service.uid"
          >
            <service
                :service-title="service.title"
                :service-id="service.uid"
                :doctors="service.doctors"
            />
          </v-col>
        </template>
        <h3 v-else>Увы, услуг по Вашему запросу не найдено</h3>
        </v-row>
      </v-skeleton-loader>
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';
  import { mdiMagnify } from '@mdi/js';
  // @ts-ignore
  import Service, { Doctor } from '@/components/Service.vue';

  interface ServiceItem {
    uid: string;
    title: string;
    doctors: Doctor[];
  }

  @Component({
    name: 'Services',
    components: { Service }
  })
  export default class Services extends Vue {
    services: ServiceItem[] = [];
    servicesLoading = false;
    searchText = '';
    searchIcon = mdiMagnify;

    async created() {
      this.servicesLoading = true;
      const specialities = await this.$api.specialities.get('', {
        params: {
          doctorsRequired: 'object'
        }
      });
      this.services = [ ...specialities.data ];
      this.servicesLoading = false;
    }

    filteredData(data: any) {
      this.services = data;
    }

    get matchedServices() {
      return [ ...this.services ].filter((item: ServiceItem) => new RegExp(this.searchText, 'gi').test(item.title));
    }
  }
</script>

<style scoped lang="sass">
  .v-skeleton-loader:not(.v-skeleton-loader--is-loading)
    display: flex

  .col
    padding: 0
</style>
