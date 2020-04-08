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
				<template #activator={on}>
					<v-btn v-on="on" color="success">
						<v-icon left>mdi-account-plus</v-icon>
						Добавить специальность
					</v-btn>
				</template>
				<v-form @submit.prevent="addSpeciality">
					<v-card>
						<v-card-title><span class="headline">Добавить специальность</span></v-card-title>
						<v-card-text>
							<v-row no-gutters>
								<v-text-field
										v-model="newSpeciality"
										:error="addError"
										:persistent-hint="addError"
										hint="Вы не можете добавить уже существующую специализацию"
										:loading="addFetching"
										:rules="[rules.isValid]"
										@focus="toggleFocus"
										@blur="specialityExists"
										@input="onSpecialityTyping"
										label="Специальность"
										outlined
										ref="newSpeciality"
								></v-text-field>
							</v-row>
						</v-card-text>
						<v-card-actions>
							<v-spacer></v-spacer>
							<v-btn
									@click="showAddDialog = false"
									color="blue darken-1"
									text
							>
								Закрыть
							</v-btn>
							<v-btn
									color="blue darken-1"
									text
									type="submit"
									:loading="addFetching"
									:disabled="isAddButtonDisabled"
							>
								Добавить
							</v-btn>
						</v-card-actions>
					</v-card>
				</v-form>
			</v-dialog>
		</v-row>
		<v-row no-gutters>
			<specialists-data-table/>
		</v-row>
	</div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { PATTERNS, SHOW_ALERT } from '@/common/constants';
// @ts-ignore
import SpecialistsDataTable from '@/components/Table/SpecialistsDataTable.vue';
import eventBus from '@/common/eventBus';

@Component({
	name: 'SpecialitiesDashboard',
	components: { SpecialistsDataTable }
})
export default class SpecialitiesDashboard extends Vue {
	showAddDialog = false;
	addFetching = false;
	addError = false;
	addFocus = false;

	newSpeciality = '';

	get isAddButtonDisabled() {
		return this.addFocus ? !this.newSpeciality : this.addError ? true : !this.newSpeciality && !this.addFetching;
	}

	async addSpeciality() {
		if(!(this.$refs.newSpeciality as any)?.valid) {
			this.addError = true;
			return;
		}

		await this.specialityExists();

		if(this.addError) {return;}

		await this.$api.specialities.post('', {
			title: this.newSpeciality
		}).then(async () => {
			eventBus.$emit(SHOW_ALERT, 'Специальность добавлена.', {
				type: 'success'
			});
			this.showAddDialog = false;
			await this.$store.dispatch('specialities/fetchSpecialities');
		})
			.catch((err) => eventBus.$emit(SHOW_ALERT, err.response?.data?.message));
	}

	toggleFocus() {
		this.addFocus = !this.addFocus;
	}

	onSpecialityTyping() {
		this.addError = false;
	}

	async specialityExists() {
		this.toggleFocus();
		if(this.newSpeciality) {
			this.addFetching = true;

			const exists = await this.$api.specialities.get('exists', {
				params: {
					title: this.newSpeciality
				}
			});

			this.addFetching = false;

			if(exists.data) {
				this.addError = true;
				return;
			}
		}
	}

	rules = {
		isValid: (v: string) => PATTERNS.NOT_EMPTY().test(v) || 'Поле не должно быть пустым.'
	}
}
</script>

<style scoped>

</style>
