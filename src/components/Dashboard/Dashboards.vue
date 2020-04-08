<template>
	<div>
		<v-tabs vertical transition="fade">
			<v-tab>
				<v-icon left>mdi-music-accidental-sharp</v-icon>
				Специальности
			</v-tab>
			<v-tab>
				<v-icon left>mdi-doctor</v-icon>
				Врачи
			</v-tab>
			<v-tab>
				<v-icon left>mdi-pen</v-icon>
				Записи
			</v-tab>
			<v-tab>
				<v-icon left>mdi-account-multiple</v-icon>
				Пользователи
			</v-tab>
			<v-tab-item>
				<specialities-dashboard/>
			</v-tab-item>
			<v-tab-item>
				<doctors-board/>
			</v-tab-item>
			<v-tab-item>
				<book-board/>
			</v-tab-item>
			<v-tab-item>
				<users-board/>
			</v-tab-item>
		</v-tabs>
	</div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
// @ts-ignore
import DoctorsBoard from '@/components/Dashboard/DoctorsBoard.vue';
// @ts-ignore
import UsersBoard from '@/components/Dashboard/UsersBoard.vue';
// @ts-ignore
import BookBoard from '@/components/Dashboard/BookBoard.vue';
// @ts-ignore
import SpecialitiesDashboard from '@/components/Dashboard/SpecialitiesDashboard.vue';

@Component({
	name: 'Dashboards',
	components: { BookBoard, UsersBoard, DoctorsBoard, SpecialitiesDashboard }
})
export default class extends Vue {

}
</script>

<style lang="sass" scoped>
	.v-tab
		justify-content: flex-start
</style>
