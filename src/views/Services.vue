<template>
  <div>
    <h1 class="mb-5">Наши услуги</h1>
    <v-dialog
        v-model="userNotAuthenticatedModal"
        width="400"
    >
      <v-card>
        <v-card-title class="headline">Ошибка</v-card-title>
        <v-card-text>{{ userNotAuthenticatedModalText }}</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
              color="green darken-1"
              text
              @click="userNotAuthenticatedModal = false"
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
    <v-dialog
        v-model="bookModal"
        width="500px"
    >
      <v-card>
        <v-card-title class="headline">Запись на прием {{bookItem.title}}</v-card-title>
        <v-card-text>
          <h3 class="font-weight-thin">Выберете врача к которому хотите записаться</h3>
        </v-card-text>
        <v-card-text>
          <v-select
              solo
              :items="bookItem.doctors"
              v-model="bookItem.doctor"
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
              text
              @click="bookModal = false"
          >
            Закрыть
          </v-btn>
          <v-btn
            text
            :disabled="!bookItem.doctor"
            @click="book"
            :loading="bookButtonLoading"
          >
            Записаться
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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
              :service="service"
              @book-modal="openBookModal"
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
  import Service from '@/components/Service.vue';
  import { getInitials } from '@/common/dev';
  import { DoctorItem } from '@/common/types';
  import eventBus from '@/common/eventBus';
  import { SHOW_ALERT } from '@/common/constants';

  interface ServiceItem {
    uid: string;
    title: string;
    doctors: DoctorItem[];
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

    bookItem: any = {
      doctor: null
    };

    bookButtonLoading = false;

    userNotAuthenticatedModal = false;
    userNotAuthenticatedModalText = 'Чтобы записаться, сперва зарегиструйтесь.';

    bookModal = false;

    get matchedServices() {
      return [ ...this.services ].filter((item: ServiceItem) => new RegExp(this.searchText, 'gi').test(item.title));
    }

    get isUserAuthenticated(): boolean {
      return this.$store.getters['user/isUserAuthenticated'];
    }

    get userData() {
      return this.$store.getters['user/userData'];
    }

    getInitials = getInitials;

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

    async openBookModal({ title, uid, doctors }: any) {
      if(!this.isUserAuthenticated) {
        this.userNotAuthenticatedModal = true;
        return;
      }

      this.bookModal = true;

      this.bookItem = { ...this.bookItem, title, uid, doctors };
      this.bookItem.doctors = [ ...this.bookItem.doctors ].map((doctor: any) => ({ value: doctor._id, text: this.getInitials(doctor) }));
    }

    async book() {
      this.bookButtonLoading = true;
      await this.$api.callback.post('', {
        doctorId: this.bookItem.doctor,
        patientPhone: this.userData.phone,
        speciality: this.bookItem.uid
      })
      .then(({ data }) => eventBus.$emit(SHOW_ALERT, data.message, { type: 'success' }))
      .catch(err => eventBus.$emit(SHOW_ALERT, err.response.data.message, { type: 'error' }));
      this.bookModal = false;
      this.bookButtonLoading = false;
    }
  }
</script>

<style scoped lang="sass">
  .v-skeleton-loader:not(.v-skeleton-loader--is-loading)
    display: flex

  .col
    padding: 0

  .v-menu__content
    min-width: initial !important
</style>
