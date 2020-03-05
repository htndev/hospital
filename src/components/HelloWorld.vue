<template>
  <v-container>
    <v-row class="text-center"> </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({
  name: 'Hi'
})
export default class Hello extends Vue {
  created() {
    console.log(this.$api);
  }
}
</script>
