<template>
	<div>
		<v-dialog
				persistent
				max-width="400px"
				v-model="showDeleteDialog"
		>
			<v-card>
				<v-card-title>Удалить запись</v-card-title>
				<v-card-text>Вы уверены, что хотите отменить прием <strong>{{callbackPersonFullname}}</strong>?</v-card-text>
				<v-card-actions>
				<v-spacer/>
				<v-btn @click="showDeleteDialog = false" text>Отмена</v-btn>
				<v-btn
						text
						color="red"
						:loading="loadingDeleteButton"
						@click="deleteBook"
				>
					Удалить
				</v-btn>
			</v-card-actions>
			</v-card>
		</v-dialog>
		<v-dialog
				v-model="showBookDialog"
				persistent
				max-width="400px"
		>
			<v-card>
				<v-card-title>Записать</v-card-title>
				<v-card-text>{{callbackPersonFullname}} на прием к {{callbackSpeciality}}.</v-card-text>
				<v-card-text>Врач: <strong>{{callbackDoctor}}</strong></v-card-text>
				<v-card-text>
					<v-row no-gutters>
						<v-col cols="5">
							<v-menu
									ref="menu"
									v-model="showDatePickerModal"
									:close-on-content-click="false"
									:return-value.sync="callbackPerson.date"
									transition="scale-transition"
									offset-y
									min-width="290px"
							>
								<template v-slot:activator="{ on }">
									<v-text-field
											v-model="callbackPerson.date"
											label="Дата записи"
											readonly
											v-on="on"
									></v-text-field>
								</template>
								<v-date-picker
										v-model="callbackPerson.date"
										no-title
										scrollable
										:min="minDate"
								>
									<v-spacer></v-spacer>
									<v-btn text color="primary" @click="showDatePickerModal = false">Отмена</v-btn>
									<v-btn text color="primary" @click="$refs.menu.save(callbackPerson.date)">OK</v-btn>
								</v-date-picker>
							</v-menu>
						</v-col>
						<v-col cols="5" offset="1">
							<v-menu
									ref="timePicker"
									v-model="showTimePickerModal"
									:close-on-content-click="false"
									:return-value.sync="callbackPerson.time"
									transition="scale-transition"
									offset-y
									min-width="290px"
							>
					<template v-slot:activator="{ on }">
						<v-text-field
								v-model="callbackPerson.time"
								label="Время записи"
								readonly
								v-on="on"
						></v-text-field>
					</template>
					<v-time-picker
							v-model="callbackPerson.time"
							format="24hr"
					>
						<v-spacer></v-spacer>
						<v-btn text color="primary" @click="showTimePickerModal = false">Отмена</v-btn>
						<v-btn text color="primary" @click="$refs.timePicker.save(callbackPerson.time)">OK</v-btn>
					</v-time-picker>
				</v-menu>
						</v-col>
					</v-row>
				</v-card-text>
				<v-card-text>
					<v-textarea
							v-model.trim="callbackPerson.comment"
							label="Комментарий"
							no-resize
							solo
					/>
				</v-card-text>
				<v-card-actions>
					<v-spacer/>
					<v-btn
							@click="showBookDialog = false"
							text
					>
						Закрыть
					</v-btn>
					<v-btn
							@click="book"
							text
							:loading="bookButtonLoading"
					>
						Записать
					</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
		<v-data-table
				:items="callbacks"
				:loading="callbacksLoading"
				:headers="tableHeading"
				hide-default-footer
				:items-per-page="Infinity"
				no-data-text="Список обратных звонков пуст."
		>
			<template #item.action={item}>
				<v-icon
						left
						small
						@click="openBookDialog(item)"
				>
					mdi-pencil
				</v-icon>
				<v-icon
						right
						small
						@click="openDeleteDialog(item)"
				>
					mdi-delete
				</v-icon>
			</template>
		</v-data-table>
	</div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import eventBus from '@/common/eventBus';
import { SHOW_ALERT } from '@/common/constants';

@Component({})
export default class CallbackDataTable extends Vue {
	callbacksLoading = false;
	callbacks = [];

	showBookDialog = false;
	showDatePickerModal = false;
	showTimePickerModal = false;
	bookButtonLoading = false;

	showDeleteDialog = false;
	loadingDeleteButton = false;

	callbackPerson: {[k: string]: any} = {
		name: '',
		surname: '',
		patronymics: '',
		doctor: {},
		patient: {},
		date: new Date().toISOString().substr(0, 10),
		time: '00:00',
		comment: ''
	};

	minDate = new Date().toISOString().substr(0, 10);

	tableHeading = [ {
		text: 'Телефон',
		value: 'patientPhone',
		sortable: false
	}, {
		text: 'Фамилия',
		value: 'patient.surname',
		sortable: false
	}, {
		text: 'Имя',
		value: 'patient.name',
		sortable: false
	}, {
		text: 'Отчество',
		value: 'patient.patronymics',
		sortable: false
	}, {
		text: 'Врач',
		value: 'speciality.title',
		sortable: false
	}, {
		text: 'Записать',
		value: 'action',
		sortable: false
	} ];

	get callbackPersonFullname() {
		return `${this.callbackPerson.patient.surname} ${this.callbackPerson.patient.name} ${this.callbackPerson.patient.patronymics}`;
	}

	get callbackSpeciality() {
		return this.callbackPerson.speciality ? this.callbackPerson.speciality.title : '';
	}

	get callbackDoctor() {
		return `${this.callbackPerson.doctor.surname} ${this.callbackPerson.doctor.name} ${this.callbackPerson.doctor.patronymics}`;
	}

	openBookDialog(person: any) {
		this.showBookDialog = true;
		this.callbackPerson = { ...this.callbackPerson, ...person };
	}

	openDeleteDialog(person: any) {
		this.showDeleteDialog = true;
		this.callbackPerson = { ...this.callbackPerson, ...person };
	}

	async book() {
		const acceptanceDate = new Date(`${this.callbackPerson.date} ${this.callbackPerson.time}`);
		const body = {
			doctorId: this.callbackPerson.doctorId,
			patientPhone: this.callbackPerson.patientPhone,
			speciality: this.callbackPerson.speciality.uid,
			acceptanceDate,
			comment: this.callbackPerson.comment,
			callbackId: this.callbackPerson._id
		};
		this.bookButtonLoading = true;
		await this.$api.book.post('', body)
							.then(({ data }) => eventBus.$emit(SHOW_ALERT, data.message, { type: 'success' }))
							.catch(({ response }) => eventBus.$emit(SHOW_ALERT, response?.data.message, { type: 'error' }));
		this.bookButtonLoading = false;
		this.showBookDialog = false;
		await this.fetchCallbacks();
		this.callbackPerson = { ...{ date: new Date().toISOString().substr(0, 10), time: '00:00', comment: '' } };
	}

	async deleteBook() {
		this.loadingDeleteButton = true;
		await this.$api.callback.delete(`/${this.callbackPerson._id}`)
		.then(({ data }) => eventBus.$emit(SHOW_ALERT, data.message, { type: 'success' }))
		.catch(({ response }) => eventBus.$emit(SHOW_ALERT, response.data?.message, { type: 'error' }));
		this.loadingDeleteButton = false;
		this.showDeleteDialog = false;
		await this.fetchCallbacks();
	}

	async created() {
		await this.fetchCallbacks();
	}

	async fetchCallbacks() {
		this.callbacksLoading = true;
		const receivedCallbacks = await this.$api.callback.get('');
		this.callbacks = receivedCallbacks.data;
		this.callbacksLoading = false;
	}
}
</script>

<style scoped>

</style>
