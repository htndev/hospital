<template>
	<div class="table-wrapper">
		<v-dialog
				v-model="showEditingDialog"
				persistent
				max-width="400px"
		>
				<v-form @submit.prevent="updateDoctor">
					<v-card>
						<v-card-title><span class="headline">Редактировать врача</span></v-card-title>
						<v-card-text>
							<v-row no-gutters>
								<v-text-field
										v-model.trim="editingDoctor.name"
										label="Имя"
										outlined
								/>
							</v-row>
							<v-row no-gutters>
								<v-text-field
										v-model.trim="editingDoctor.surname"
										label="Фамилия"
										outlined
								/>
							</v-row>
							<v-row no-gutters>
								<v-text-field
										v-model.trim="editingDoctor.patronymics"
										label="Отчество"
										outlined
								/>
							</v-row>
							<v-row no-gutters>
								<v-file-input
										v-model="editingDoctor.newAvatar"
										ref="avatar"
										accept="image/*"
										label="Аватар"
										dense
										outlined
										prepend-icon=""
										show-size
								>
									<template #append-outer>
										<v-avatar
												size="30"
										>
											<img :src="getSrc(editingDoctor.avatar)" alt="Doctor image">
										</v-avatar>
									</template>
								</v-file-input>
							</v-row>
							<v-row no-gutters>
								<v-select
										v-model="editingDoctor.specialities"
										:items="[...specialities]"
										multiple
										chips
										outlined
										dense
								/>
							</v-row>
						</v-card-text>
						<v-card-actions>
							<v-spacer></v-spacer>
							<v-btn color="blue darken-1" text @click="showEditingDialog = false">Закрыть</v-btn>
							<v-btn color="blue darken-1" text type="submit">Обновить</v-btn>
						</v-card-actions>
					</v-card>
				</v-form>
			</v-dialog>
		<v-dialog
			v-model="showDeletingDialog"
			persistent
			max-width="400px"
		>
			<v-form>
				<v-card>
					<v-card-title class="headline">Удаление</v-card-title>
					<v-card-text>Вы действительно хотите удалить <strong>{{getDeletingDoctorFullname}}</strong>?</v-card-text>
					<v-card-actions>
						<v-spacer></v-spacer>
						<v-btn
								text
								@click="showDeletingDialog = false"
						>
							Закрыть
						</v-btn>
						<v-btn
								text
								color="red"
								:loading="deleteButtonLoading"
								@click="deleteDoctor"
						>
							Удалить
						</v-btn>
					</v-card-actions>
				</v-card>
			</v-form>
		</v-dialog>
		<div class="doctor-table">
			<v-data-table
					no-data-text="Врачи не найдены."
					:items-per-page="Infinity"
					hide-default-footer
					:loading="doctorsFetching"
					:items="[...doctors]"
					:headers="headers"
			>
			<template #item.image="{item}">
				<div class="doctor-avatar">
					<v-avatar size="65">
						<img :src="getSrc(item.image)" alt="Doctor image">
					</v-avatar>
				</div>
			</template>
			<template #item.specialities="{item}">
				<div class="speciality-wrapper">
					<v-chip-group v-if="item.specialities.length">
					<v-chip
							v-for="spec in item.specialities"
							:key="spec.uid"
							color="green"
							text-color="white"
					>{{spec.title}}</v-chip>
				</v-chip-group>
					<p v-else>Нет специализации</p>
				</div>
			</template>
			<template #item.actions="{item}">
				<v-icon
						small
						class="mr-2"
						@click="editDoctor(item)"
				>
					mdi-pencil
				</v-icon>
				<v-icon
						small
						@click="setDeletingDoctor(item)"
				>
					mdi-delete
				</v-icon>
			</template>
		</v-data-table>
		</div>
	</div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { DOCTOR_IMAGES_PATH, DEFAULT_DOCTOR_IMAGE, SHOW_ALERT } from '@/common/constants';
import eventBus from '@/common/eventBus';

@Component({
	name: 'DoctorsDataTable'
})
export default class DoctorsDataTable extends Vue {
	doctors = [];
	specialities = [];
	showEditingDialog = false;

	editingDoctor = {
		_id: '',
		name: '',
		surname: '',
		patronymics: '',
		avatar: null,
		specialities: [],
		newAvatar: null
	};

	showDeletingDialog = false;
	deleteButtonLoading = false;
	deletingDoctor = {
		_id: '',
		name: '',
		surname: '',
		patronymics: '',
		avatar: null
	};

	doctorsFetching = false;

	headers = [
		{
			text    : 'Аватар',
			value   : 'image',
			sortable: false
		},
		{
			text    : 'Фамилия',
			value   : 'surname',
			sortable: true
		},
		{
			text    : 'Имя',
			value   : 'name',
			sortable: true
		},
		{
			text    : 'Отчетсво',
			value   : 'patronymics',
			sortable: true
		},
		{
			text    : 'Специальности',
			value   : 'specialities',
			sortable: true
		},
		{
			text    : 'Действия',
			value   : 'actions',
			sortable: false
		}
	];

	get getDeletingDoctorFullname() {
		return `${this.deletingDoctor.surname} ${this.deletingDoctor.name} ${this.deletingDoctor.patronymics}`.trim();
	}

	async created() {
		await this.fetchDoctors();

		this.$on('sync:doctors', async () => {
			await this.fetchDoctors();
		});
	}

	getSrc(image: string | null): string {
		return `${DOCTOR_IMAGES_PATH}/${image ? image : DEFAULT_DOCTOR_IMAGE}`;
	}

	async fetchDoctors() {
		this.doctorsFetching = true;
		this.doctors = (await this.$api.doctor.get('') as any).data;
		this.doctorsFetching = false;
	}

	async editDoctor(item: any) {
		const specs = (await this.$api.specialities.get('') as any).data;
		this.specialities = specs.map((spec: any) => ({ text: spec.title, value: spec.uid }));
		this.editingDoctor._id = item._id;
		this.editingDoctor.name = item.name;
		this.editingDoctor.surname = item.surname;
		this.editingDoctor.patronymics = item.patronymics;
		this.editingDoctor.specialities = item.specialities.map((spec: any) => ({ value: spec.uid, text: spec.title }));
		this.editingDoctor.avatar = item.image;
		this.showEditingDialog = true;
	}

	setDeletingDoctor(item: any) {
		this.deletingDoctor = { ...item };
		this.showDeletingDialog = true;
	}

	async deleteDoctor() {
		this.deleteButtonLoading = true;
		await this.$api.doctor
							.delete(`/${this.deletingDoctor._id}`)
							.then(({ data }: any) => eventBus.$emit(SHOW_ALERT, data.message, {
								type: 'success'
							}))
							.catch(({ response }: any) => eventBus.$emit(SHOW_ALERT, response.data?.message, {
								type: 'error'
							}));
		this.deleteButtonLoading = false;
		this.showDeletingDialog = false;
		await this.fetchDoctors();
	}

	async updateDoctor() {
		const fd = new FormData();
		fd.append('_id', this.editingDoctor._id);
		fd.append('name', this.editingDoctor.name);
		fd.append('surname', this.editingDoctor.surname);
		fd.append('patronymics', this.editingDoctor.patronymics);
		let speciality: any = [ ...this.editingDoctor.specialities ];
		if(this.isCastRequired(speciality)) {
			speciality = speciality.map((speciality: any) => speciality.value) as [];
		}
		fd.append('speciality', JSON.stringify(speciality));
		const avatar = this.editingDoctor.newAvatar;
		if (avatar) {
			fd.append('file', (this.$refs.avatar as any).value);
		}

		await this.$api.doctor
							.put('', fd)
							.then(() => {
								eventBus.$emit(SHOW_ALERT, 'Врач успешно добавлен.', { type: 'success' });
							})
							.catch(err => eventBus.$emit(SHOW_ALERT, err.response?.data.message, { type: 'error' }));

		this.editingDoctor.name = '';
		this.editingDoctor.surname = '';
		this.editingDoctor.patronymics = '';
		this.editingDoctor.avatar = null;
		this.editingDoctor.newAvatar = null;
		this.editingDoctor.specialities = [];

		this.showEditingDialog = false;
		await this.fetchDoctors();
	}

	isCastRequired(array: [] = []) {
		// @ts-ignore
		return !this.$_.isEmpty(array) && this.$_.isPlainObject(array[0]);
	}
}
</script>

<style scoped lang="sass">
.table-wrapper
	width: 100%

	&::v-deep .speciality-wrapper .v-slide-group__content
		flex-wrap: wrap
		max-width: 400px

	&::v-deep .doctor-avatar
		padding: 5px 0
</style>
