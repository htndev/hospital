<template>
  <v-container>
    <h1 class="heading text-center">Login</h1>
    <v-row
      justify="center"
    >
      <v-col
        cols="4"
      >
        <v-form
            lazy-validation
            @submit.prevent="login"
            class="d-flex flex-column align-center"
        >
          <v-text-field
            outlined
            label="Логин"
            v-model="loginText"
            full-width
          />
          <v-text-field
            outlined
            label="Пароль"
            v-model="passwordText"
          />
          <v-btn
              outlined
              type="submit"
          >
            Войти
          </v-btn>
        </v-form>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';

  @Component({
    name: 'Login'
  })
  export default class Login extends Vue {
    loginText = '';
    passwordText = '';

    login() {
      console.log(this.loginText);
      console.log(this.passwordText);
    }
  }
</script>

<style scoped>

</style>
