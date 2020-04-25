<template>
	<div>
		<books-data-table/>
	</div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
// @ts-ignore
import BooksDataTable from '@/components/Table/BooksDataTable.vue';

@Component({
	name: 'BookBoard',
	components: { BooksDataTable }
})
export default class BookBoard extends Vue {

}
</script>

<style scoped>

</style>
