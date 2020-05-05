<template>
  <div>
    <v-tabs :centered="false">
      <v-tab>Приемов к врачам за пероид</v-tab>
      <v-tab>Рейтинг специальностей</v-tab>
      <v-tab-item>
        <stats-books-by-period />
      </v-tab-item>
      <v-tab-item>
        <stats-specialities />
      </v-tab-item>
    </v-tabs>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import StatsBooksByPeriod from './StatsBooksByPeriod.vue';
import StatsSpecialities from './StatsSpecialities.vue';

@Component({
  components: { StatsBooksByPeriod, StatsSpecialities }
})
export default class StatisBoard extends Vue {}
</script>