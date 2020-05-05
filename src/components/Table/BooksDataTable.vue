<template>
  <div>
    <v-text-field v-model="search" label="Поиск" />
    <v-dialog persistent max-width="400px" v-model="showDeleteDialog">
      <v-card>
        <v-card-title>Удалить запись</v-card-title>
        <v-card-text>
          Вы уверены, что хотите отменить прием
          <strong>{{editingPersonFullname}}</strong>?
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="showDeleteDialog = false" text>Отмена</v-btn>
          <v-btn text color="red" :loading="loadingDeleteButton" @click="deleteBook">Удалить</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="showEditDialog" persistent max-width="400px">
      <v-card>
        <v-card-title>Редактировать запись</v-card-title>
        <v-card-text>{{editingPersonFullname}} на прием к {{callbackSpeciality}}.</v-card-text>
        <v-card-text>
          Врач:
          <strong>{{callbackDoctor}}</strong>
        </v-card-text>
        <v-card-text>
          <v-row no-gutters>
            <v-col cols="5">
              <v-menu
                ref="menu"
                v-model="showDatePickerModal"
                :close-on-content-click="false"
                :return-value.sync="editingPerson.date"
                transition="scale-transition"
                offset-y
                min-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field v-model="editingPerson.date" label="Дата записи" readonly v-on="on"></v-text-field>
                </template>
                <v-date-picker v-model="editingPerson.date" no-title scrollable :min="minDate">
                  <v-spacer></v-spacer>
                  <v-btn text color="primary" @click="showDatePickerModal = false">Отмена</v-btn>
                  <v-btn text color="primary" @click="$refs.menu.save(editingPerson.date)">OK</v-btn>
                </v-date-picker>
              </v-menu>
            </v-col>
            <v-col cols="5" offset="1">
              <v-menu
                ref="timePicker"
                v-model="showTimePickerModal"
                :close-on-content-click="false"
                :return-value.sync="editingPerson.time"
                transition="scale-transition"
                offset-y
                min-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-model="editingPerson.time"
                    label="Время записи"
                    readonly
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-time-picker v-model="editingPerson.time" format="24hr">
                  <v-spacer></v-spacer>
                  <v-btn text color="primary" @click="showTimePickerModal = false">Отмена</v-btn>
                  <v-btn text color="primary" @click="$refs.timePicker.save(editingPerson.time)">OK</v-btn>
                </v-time-picker>
              </v-menu>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-text>
          <v-textarea v-model.trim="editingPerson.comment" label="Комментарий" no-resize solo />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="showEditDialog = false" text>Закрыть</v-btn>
          <v-btn @click="editBook" text :loading="editBookButtonLoading">Записать</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-data-table hide-default-footer :headers="tableHeading" :items="books" :search="search">
      <template #item.fullname="{item}">
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <span v-on="on">{{getShortName(item.patient)}}</span>
          </template>
          <span>{{getFullname(item.patient)}}</span>
        </v-tooltip>
      </template>
      <template #item.doctor="{item}">
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <span v-on="on">{{getShortName(item.doctor)}}</span>
          </template>
          <span>{{getFullname(item.doctor)}}</span>
        </v-tooltip>
      </template>
      <template #item.acceptanceDate="{item}">{{m(item.acceptanceDate).locale('ru').format('LLLL')}}</template>
      <template #item.action="{item}">
        <v-icon @click="openEditDialog(item)" left small>mdi-pencil</v-icon>
        <v-icon left small @click="openDeleteModal(item)">mdi-delete</v-icon>
      </template>
    </v-data-table>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import * as moment from 'moment';
import eventBus from '@/common/eventBus';
import { SHOW_ALERT } from '@/common/constants';

@Component({})
export default class BooksDataTable extends Vue {
  search = '';

  books = [];
  bookTableLoading = false;

  minDate = new Date().toISOString().substr(0, 10);
  editBookButtonLoading = false;

  showEditDialog = false;
  showDatePickerModal = false;
  showTimePickerModal = false;
  editButtonLoading = false;

  showDeleteDialog = false;
  loadingDeleteButton = false;

  editingPerson: { [k: string]: any } = {
    name: '',
    surname: '',
    patronymics: '',
    doctor: {},
    patient: {},
    date: new Date().toISOString().substr(0, 10),
    time: '00:00',
    comment: ''
  };

  tableHeading = [
    {
      text: 'Телефон',
      value: 'patient.phone',
      sortable: false
    },
    {
      text: 'Полное имя',
      value: 'fullname',
      sortable: false
    },
    {
      text: 'Специальность',
      value: 'speciality.title',
      sortable: false
    },
    {
      text: 'Комментарий',
      value: 'comment',
      sortable: false
    },
    {
      text: 'Врач',
      value: 'doctor',
      sortable: false
    },
    {
      text: 'Дата приема',
      value: 'acceptanceDate',
      sortable: false
    },
    {
      text: 'Записать',
      value: 'action',
      sortable: false
    }
  ];

  get editingPersonFullname() {
    return `${this.editingPerson.patient.surname} ${this.editingPerson.patient.name} ${this.editingPerson.patient.patronymics}`;
  }

  get callbackSpeciality() {
    return this.editingPerson.speciality
      ? this.editingPerson.speciality.title
      : '';
  }

  get callbackDoctor() {
    return `${this.editingPerson.doctor.surname} ${this.editingPerson.doctor.name} ${this.editingPerson.doctor.patronymics}`;
  }

  m = moment;

  openEditDialog(person: any) {
    this.editingPerson = {
      ...this.editingPerson,
      ...person,
      ...this.getDate(new Date(person.acceptanceDate))
    };
    this.showEditDialog = true;
  }

  private getDate(date: Date): {} {
    return {
      date: date.toISOString().substr(0, 10),
      time: `${date.getHours()}:${date.getMinutes()}`
    };
  }

  async fetchCallbacks() {
    this.bookTableLoading = false;
    const receivedCallbacks = await this.$api.book.get('');
    this.books = receivedCallbacks.data;
    this.bookTableLoading = true;
  }

  getShortName({ name, surname, patronymics }: any) {
    return `${surname} ${name[0]}. ${patronymics[0]}.`;
  }

  getFullname({ name, surname, patronymics }: any) {
    return `${surname} ${name} ${patronymics}`;
  }

  async editBook() {
    const acceptanceDate = new Date(
      `${this.editingPerson.date} ${this.editingPerson.time}`
    );
    const body = {
      id: this.editingPerson._id,
      acceptanceDate,
      comment: this.editingPerson.comment
    };
    this.editButtonLoading = true;
    await this.$api.book
      .put('', body)
      .then(({ data }) =>
        eventBus.$emit(SHOW_ALERT, data.message, { type: 'success' })
      )
      .catch(({ response }) =>
        eventBus.$emit(SHOW_ALERT, response?.data.message, { type: 'error' })
      );
    this.editButtonLoading = false;
    this.showEditDialog = false;
    await this.fetchCallbacks();
  }

  openDeleteModal(person: any) {
    this.editingPerson = { ...this.editingPerson, ...person };
    this.showDeleteDialog = true;
  }

  async deleteBook() {
    this.loadingDeleteButton = true;
    await this.$api.book
      .delete(`/${this.editingPerson._id}`)
      .then(({ data }) =>
        eventBus.$emit(SHOW_ALERT, data.message, { type: 'success' })
      )
      .catch(({ response }) =>
        eventBus.$emit(SHOW_ALERT, response?.data.message, { type: 'error' })
      );
    this.loadingDeleteButton = false;
    this.showDeleteDialog = false;
    await this.fetchCallbacks();
  }

  async created() {
    await this.fetchCallbacks();
  }
}
</script>

<style lang="sass" scoped>
</style>
