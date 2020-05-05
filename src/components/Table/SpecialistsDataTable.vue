<template>
  <div class="specialists-data-table mt-10">
    <v-text-field v-model="search" label="Поиск" />
    <v-dialog v-model="showEditDialog" persistent max-width="400px">
      <v-form @submit.prevent="updateSpeciality">
        <v-card>
          <v-card-title>
            <span class="headline">Редактировать специальность</span>
          </v-card-title>
          <v-card-text>
            <v-row no-gutters>
              <v-text-field
                v-model.trim="editSpeciality"
                :error="editError"
                :persistent-hint="editError"
                hint="Вы не можете изменить уже существующую специализацию"
                :loading="editFetching"
                :rules="[rules.isValid]"
                @focus="toggleFocus"
                @blur="specialityExists"
                @input="onSpecialityTyping"
                label="Специальность"
                outlined
                ref="editSpeciality"
              ></v-text-field>
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn @click="showEditDialog = false" color="blue darken-1" text>Закрыть</v-btn>
            <v-dialog></v-dialog>
            <v-btn
              color="blue darken-1"
              text
              type="submit"
              :loading="editFetching"
              :disabled="isEditButtonDisabled"
            >Обновить</v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>
    <v-dialog v-model="showDeleteModal" persistent max-width="290">
      <v-card>
        <v-card-title class="headline">Уаление</v-card-title>
        <v-card-text>
          Вы действительно хотите удалить специализацию
          <strong>{{deletingItem.title}}</strong>?
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text @click="showDeleteModal = false">Закрыть</v-btn>
          <v-btn text color="red" :loading="deletingButtonLoading" @click="deleteSpeciality">Удалить</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-data-table
      :headers="headers"
      no-data-text="Нету ни одной специальности."
      hide-default-footer
      :items="specialities"
      :items-per-page="Infinity"
      :search="search"
    >
      <template #item.actions="{item}">
        <v-icon small class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
        <v-icon small @click="deleteItem(item)">mdi-delete</v-icon>
      </template>
    </v-data-table>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import eventBus from '@/common/eventBus';
import { PATTERNS, SHOW_ALERT } from '@/common/constants';

@Component({
  name: 'SpecialistsDataTable'
})
export default class SpecialistsDataTable extends Vue {
  search = '';
  showEditDialog = false;
  editSpeciality = '';
  editFetching = false;
  editError = false;
  editFocus = false;
  editUid = '';
  origSpec = '';
  showDeleteModal = false;
  deletingButtonLoading = false;
  deletingItem = {
    title: '',
    uid: ''
  };
  headers = [
    {
      text: 'Название',
      value: 'title',
      sortable: true
    },
    {
      text: 'Уникальный номер',
      value: 'uid',
      sortable: true
    },
    {
      text: 'Количество врачей',
      value: 'amount',
      sortable: true
    },
    {
      text: 'Действия',
      value: 'actions',
      sortable: false
    }
  ];
  rules = {
    isValid: (v: string) =>
      PATTERNS.NOT_EMPTY().test(v) || 'Поле не должно быть пустым.'
  };

  get isEditButtonDisabled() {
    return this.editFocus
      ? !this.editSpeciality
      : this.editError
      ? true
      : !this.editSpeciality &&
        this.origSpec !== this.editSpeciality &&
        !this.editFetching;
  }

  async fetchSpecialities() {
    return await this.$store.dispatch('specialities/fetchSpecialities');
  }

  get specialities() {
    return this.$store.getters['specialities/specialities'];
  }

  async created() {
    await this.fetchSpecialities();
  }

  async editItem(item: any) {
    this.editSpeciality = item.title;
    this.origSpec = item.title;
    this.editUid = item.uid;
    this.showEditDialog = true;
  }

  async deleteItem(item: any) {
    this.deletingItem = item;
    this.showDeleteModal = true;
  }

  toggleFocus() {
    this.editFocus = !this.editFocus;
  }

  onSpecialityTyping() {
    this.editError = false;
  }

  async specialityExists() {
    this.toggleFocus();
    if (this.origSpec !== this.editSpeciality) {
      if (this.editSpeciality) {
        this.editFetching = true;

        const exists = await this.$api.specialities.get('exists', {
          params: {
            title: this.editSpeciality
          }
        });

        this.editFetching = false;

        if (exists.data) {
          this.editError = true;
          return;
        }
      }
    }
  }

  async updateSpeciality() {
    if (!(this.$refs.editSpeciality as any)?.valid) {
      this.editError = true;
      return;
    }

    await this.specialityExists();

    if (this.editError) {
      return;
    }

    await this.$api.specialities
      .put('', {
        title: this.editSpeciality,
        uid: this.editUid
      })
      .then(async () => {
        eventBus.$emit(SHOW_ALERT, 'Специальность обновлена.', {
          type: 'success'
        });
        this.showEditDialog = false;
        this.origSpec = '';
        await this.$store.dispatch('specialities/fetchSpecialities');
      })
      .catch(err => eventBus.$emit(SHOW_ALERT, err.response?.data?.message));
  }

  async deleteSpeciality() {
    this.deletingButtonLoading = true;
    await this.$api.specialities
      .delete(`/${this.deletingItem.uid}`)
      .then(({ data }) =>
        eventBus.$emit(SHOW_ALERT, data.message, {
          type: 'success'
        })
      )
      .catch(err =>
        eventBus.$emit(SHOW_ALERT, err.response.data?.message, {
          type: 'error'
        })
      );

    this.deletingButtonLoading = false;
    this.showDeleteModal = false;
    await this.fetchSpecialities();
  }
}
</script>

<style scoped lang="sass">
.specialists-data-table
	width: 100%
</style>
