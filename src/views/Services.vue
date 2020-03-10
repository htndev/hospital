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
    <v-row no-gutters>
      <v-skeleton-loader
          :loading="servicesLoading"
          width="340"
          type="card"
      >
        <template v-if="matchedServices.length">
          <service
              v-for="(service, index) in matchedServices"
              :key="index"
              :service-title="service.title"
              :service-description="service.description"
              :service-image="service.image"
              :doctors="service.doctors"
          />
        </template>
        <h3 v-else>Увы, услуг по Вашему запросу не найдено</h3>
      </v-skeleton-loader>
    </v-row>
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';
  import { mdiMagnify } from '@mdi/js';
  // @ts-ignore
  import Service, { Doctor } from '@/components/Service.vue';

  interface ServiceItem {
    title: string;
    description: string;
    image: string;
    doctors: Doctor[];
  }

  @Component({
    name: 'Services',
    components: { Service }
  })
  export default class Services extends Vue {
    services: ServiceItem[] = [
      {
        title: 'МРТ',
        description: 'Описание МРТ',
        image: 'https://s15.stc.all.kpcdn.net/share/i/12/10983569/inx960x640.jpg',
        doctors: [
          {
            name: 'Имя Фамилия',
            image: 'https://www.gostudy.cz/wp-content/themes/gostudy_eighteen/assets/pages/doctors/images/doctor-cut.png'
          }
        ]
      },
      {
        title: 'ЭКГ',
        description: 'lorem ipsum dolar',
        image: 'https://s15.stc.all.kpcdn.net/share/i/12/10983569/inx960x640.jpg',
        doctors: [
          {
            name: 'Имя Фамилия',
            image: 'https://www.gostudy.cz/wp-content/themes/gostudy_eighteen/assets/pages/doctors/images/doctor-cut.png'
          }
        ]
      },
      {
        title: 'ЭРМ',
        description: 'lorem ipsum dolar',
        image: 'https://s15.stc.all.kpcdn.net/share/i/12/10983569/inx960x640.jpg',
        doctors: [
          {
            name: 'Имя Фамилия',
            image: 'https://www.gostudy.cz/wp-content/themes/gostudy_eighteen/assets/pages/doctors/images/doctor-cut.png'
          }
        ]
      },
    ];
    servicesLoading = true;
    searchText = '';
    searchIcon = mdiMagnify;

    created() {
      setTimeout(() => { this.servicesLoading = false; }, 3000);
    }

    filteredData(data: any) {
      this.services = data;
    }

    get matchedServices() {
      return [...this.services].filter((item: ServiceItem) => new RegExp(this.searchText, 'gi').test(item.title));
    }
  }
</script>

<style scoped lang="sass">
  .v-skeleton-loader:not(.v-skeleton-loader--is-loading)
    display: flex

  .col
    padding: 0
</style>
