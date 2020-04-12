<template>
	<div>
		<v-row
				no-gutters
				justify="end"
		>
			<v-dialog
					v-model="showAddDialog"
					persistent
					max-width="400px"
			>
				<template #activator="{ on }">
					<v-btn color="success" v-on="on">
						<v-icon left>mdi-account-plus</v-icon>
						Добавить врача
					</v-btn>
				</template>
				<v-form @submit.prevent="addDoctor">
					<v-card>
						<v-card-title><span class="headline">Добавить врача</span></v-card-title>
						<v-card-text>
							<v-row no-gutters>
								<v-text-field
										v-model.trim="newDoctor.surname"
										label="Фамилия"
										outlined
								/>
							</v-row>
							<v-row no-gutters>
								<v-text-field
										v-model.trim="newDoctor.name"
										label="Имя"
										outlined
								/>
							</v-row>
							<v-row no-gutters>
								<v-text-field
										v-model.trim="newDoctor.patronymics"
										label="Отчество"
										outlined
								/>
							</v-row>
							<v-row no-gutters>
								<v-file-input
										v-model="newDoctor.avatar"
										ref="avatar"
										accept="image/*"
										label="Аватар"
										dense
										outlined
								/>
							</v-row>
							<v-row no-gutters>
								<v-select
										v-model="newDoctor.specialities"
										:items="[...specialities]"
										multiple
										chips
										outlined
										dense
										:loading="specsFetching"
								/>
							</v-row>
						</v-card-text>
						<v-card-actions>
							<v-spacer></v-spacer>
							<v-btn color="blue darken-1" text @click="showAddDialog = false">Закрыть</v-btn>
							<v-btn color="blue darken-1" text type="submit">Добавить</v-btn>
						</v-card-actions>
					</v-card>
				</v-form>
			</v-dialog>
		</v-row>
		<v-row>
			<doctors-data-table ref="doctorsTable"/>
		</v-row>
	</div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import eventBus from '@/common/eventBus';
import { SHOW_ALERT } from '@/common/constants';
// @ts-ignore
import DoctorsDataTable from '@/components/Table/DoctorsDataTable.vue';

@Component({
	name: 'DoctorsBoard',
	components: { DoctorsDataTable }
})
export default class DoctorsBoard extends Vue {
	showAddDialog = false;
	specialities = [];
	specsFetching = false;
	doctorsFetching = false;

	newDoctor = {
		name: '',
		surname: '',
		patronymics: '',
		avatar: null,
		specialities: []
	};

	async created() {
		this.specsFetching = true;
		const specs = (await this.$api.specialities.get('') as any).data;
		this.specialities = specs.map((spec: any) => ({ text: spec.title, value: spec.uid }));
		this.specsFetching = false;
	}

	async addDoctor() {
		const fd = new FormData();
		fd.append('name', this.newDoctor.name);
		fd.append('surname', this.newDoctor.surname);
		fd.append('patronymics', this.newDoctor.patronymics);
		fd.append('speciality', JSON.stringify(this.newDoctor.specialities));
		const avatar = this.newDoctor.avatar;
		if(avatar) {
			fd.append('file', avatar);
		}

		await this.$api.doctor
							.post('', fd)
							.then(() => {
								eventBus.$emit(SHOW_ALERT, 'Врач успешно добавлен.', { type: 'success' });
							})
							.catch(err => eventBus.$emit(SHOW_ALERT, err.response?.data.message, { type: 'error' }));

		this.newDoctor.name = '';
		this.newDoctor.surname = '';
		this.newDoctor.patronymics = '';
		this.newDoctor.avatar = null;
		this.newDoctor.specialities = [];

		this.showAddDialog = false;

		(this.$refs.doctorsTable as any).$emit('sync:doctors');
	}
}
</script>

<style scoped>

</style>
