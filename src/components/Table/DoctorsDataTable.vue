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
										ref="avatar"
										accept="image/*"
										label="Аватар"
										dense
										outlined
										prepend-icon=""
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
		<v-data-table
				no-data-text="Врачи не найдены."
				:items-per-page="Infinity"
				hide-default-footer
				:loading="doctorsFetching"
				:items="[...doctors]"
				:headers="headers"
		>
			<template #item.image="{item}">
				<v-avatar size="35">
					<img :src="getSrc(item.image)" alt="Doctor image">
				</v-avatar>
			</template>
			<template #item.specialities="{item}">
				<v-chip-group v-if="item.specialities.length">
					<v-chip
							v-for="spec in item.specialities"
							:key="spec.uid"
							color="green"
							text-color="white"
					>{{spec.title}}</v-chip>
				</v-chip-group>
				<p v-else>Нет специализации</p>
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
					@click="deleteDoctor(item)"
				>
					mdi-delete
				</v-icon>
			</template>
		</v-data-table>
	</div>
</template>

<script lang="ts">
import { Component, Vue }                                       from 'vue-property-decorator';
import { DOCTOR_IMAGES_PATH, DEFAULT_DOCTOR_IMAGE, SHOW_ALERT } from '@/common/constants';
import eventBus                                                 from '@/common/eventBus';

@Component({
	name: 'DoctorsDataTable'
})
export default class DoctorsDataTable extends Vue {
	doctors = [];
	specialities = [];
	editingDoctor = {
		_id: '',
		name: '',
		surname: '',
		patronymics: '',
		avatar: null,
		specialities: []
	};

	showEditingDialog = false;
	doctorsFetching = false;

	headers = [
		{
			text: 'Аватар',
			value: 'image',
			sortable: false
		},
		{
			text: 'Фамилия',
			value: 'surname',
			sortable: true
		},
		{
			text: 'Имя',
			value: 'name',
			sortable: true
		},
		{
			text: 'Отчетсво',
			value: 'patronymics',
			sortable: true
		},
		{
			text: 'Специальности',
			value: 'specialities',
			sortable: true
		},
		{
			text: 'Действия',
			value: 'actions',
			sortable: false
		}
	];

	async created() {
		this.doctorsFetching = true;
		this.doctors = (await this.$api.doctor.get('') as any).data;
		this.doctorsFetching = false;
	}

	getSrc(image: string | null): string {
		return `${DOCTOR_IMAGES_PATH}/${image ? image : DEFAULT_DOCTOR_IMAGE}`;
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

	async deleteDoctor(item: any) {
		console.log(item);
	}

	async updateDoctor() {
		const fd = new FormData();
		fd.append('_id', this.editingDoctor._id);
		fd.append('name', this.editingDoctor.name);
		fd.append('surname', this.editingDoctor.surname);
		fd.append('patronymics', this.editingDoctor.patronymics);
		fd.append('speciality', JSON.stringify(this.editingDoctor.specialities));
		const avatar = (this.$refs.avatar as any).value;
		if(avatar) {
			fd.append('avatar', (this.$refs.avatar as any).value);
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
		this.editingDoctor.specialities = [];

		this.showEditingDialog = false;

		return;
	}
}
</script>

<style scoped lang="sass">
.table-wrapper
	width: 100%
</style>
