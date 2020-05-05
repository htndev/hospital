<template>
  <div>
    <v-row no-gutters>
      <v-col cols="2">
        <v-menu
          ref="gte"
          v-model="showGte"
          :close-on-content-click="false"
          :return-value.sync="gte"
          transition="scale-transition"
          offset-y
          min-width="290px"
        >
          <template v-slot:activator="{ on }">
            <v-text-field v-model="gte" label="С" readonly v-on="on"></v-text-field>
          </template>
          <v-date-picker v-model="gte" no-title scrollable>
            <v-spacer></v-spacer>
            <v-btn text color="primary" @click="showGte = false">Отмена</v-btn>
            <v-btn text color="primary" @click="$refs.gte.save(gte)">OK</v-btn>
          </v-date-picker>
        </v-menu>
      </v-col>
      <v-col cols="2" offset="1">
        <v-menu
          ref="lte"
          v-model="showLte"
          :close-on-content-click="false"
          :return-value.sync="lte"
          transition="scale-transition"
          offset-y
          min-width="290px"
        >
          <template v-slot:activator="{ on }">
            <v-text-field v-model="lte" label="До" readonly v-on="on"></v-text-field>
          </template>
          <v-date-picker v-model="lte" no-title scrollable>
            <v-spacer></v-spacer>
            <v-btn text color="primary" @click="showLte = false">Отмена</v-btn>
            <v-btn text color="primary" @click="$refs.lte.save(lte)">OK</v-btn>
          </v-date-picker>
        </v-menu>
      </v-col>
      <v-col cols="2" offset="1">
        <v-btn class="mt-3" @click="searchBooks">Искать</v-btn>
      </v-col>
    </v-row>
    <div class="table-wrapper">
      <v-text-field v-model="search" label="Поиск" />
      <v-data-table
        :items-per-page="Infinity"
        :items="items"
        no-data-text="Нету данных"
        :loading="loading"
        :headers="headers"
        hide-default-footer
        :search="search"
      />
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
@Component({})
export default class StatsBooksByPeriod extends Vue {
  search = '';
  private showGte = false;
  private gte = '';
  private showLte = false;
  private lte = '';
  private items = [];
  private loading = false;
  private headers = [
    {
      value: 'fullname',
      text: 'ФИО',
      sortable: true
    },
    {
      value: 'books',
      text: 'Количество записей',
      sortable: true
    }
  ];
  async searchBooks() {
    if (!this.lte && !this.gte) {
      return;
    }
    this.loading = true;
    const stats: any = await this.$api.stats.post('/period', {
      lte: new Date(this.lte),
      gte: new Date(this.gte)
    });

    // console.log(stats);
    this.items = stats.data as [];
    this.loading = false;
  }
}
</script>
<style lang="sass">
.table-wrapper
  width: 100%
</style>