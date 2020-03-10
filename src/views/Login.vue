<template>
  <v-container>
    <h1 class="heading text-center">Войти</h1>
    <v-alert
        border="left"
        elevation="2"
        type="error"
        v-model="showError"
        transition="slide-x-reverse-transition"
    >
      {{ errorText }}
    </v-alert>
    <v-row justify="center">
      <v-col cols="6">
        <v-form lazy-validation @submit.prevent="login" class="d-flex flex-column align-center">
          <v-text-field
              v-model="loginText"
              outlined
              label="Email"
              :rules="[rules.required, rules.emailOverflow]"
              :maxlength="maxEmailLength"
              ref="email"
          />
          <v-text-field
              v-model="passwordText"
              outlined
              label="Пароль"
              type="password"
              :rules="[rules.required, rules.passwordOverflow]"
              :maxlength="maxPasswordLength"
              ref="password"
          />
          <v-btn outlined type="submit">Войти</v-btn>
        </v-form>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import { MAX_PASSWORD_LENGTH, MAX_EMAIL_LENGTH } from '@/common/constants';

const user = namespace('user');

@Component({
  name: 'Login'
})
export default class Login extends Vue {
  loginText = '';
  passwordText = '';
  errorText = '';
  showError = false;
  @user.Action
  authorizeUser!: (data: { email: string; password: string }) => string;
  maxEmailLength = MAX_EMAIL_LENGTH;
  maxPasswordLength = MAX_PASSWORD_LENGTH;
  errors = {
    email: false,
    password: false
  };
  rules = {
    required: (v: string) => !!v || 'Поле не должно быть пустым.',
    emailOverflow: (v: string) => v.length <= MAX_EMAIL_LENGTH || `Email должен быть меньше ${MAX_EMAIL_LENGTH} символов.`,
    passwordOverflow: (v: string) => v.length <= MAX_PASSWORD_LENGTH || `Пароль должен быть меньше ${MAX_PASSWORD_LENGTH} символов.`
  };

  login() {
    const isValid = this.validateFields();

    console.log(isValid);
    if(!isValid) {
      this.triggerAllFields();
      this.toggleAlert('Заполните все поля правильными значениями!');
      return;
    }

    console.log(this.loginText);
    console.log(this.passwordText);
    console.log(this.authorizeUser({ email: this.loginText, password: this.passwordText }));
  }

  toggleAlert(text = 'Что-то пошло не так. Извините.') {
    this.showError = true;
    this.errorText = text;
    setTimeout(() => {
      this.showError = false;
    }, 3000);
  }

  triggerAllFields() {
    Object.keys(this.$refs).forEach(field => {
      if(!(this.$refs[field]as any).valid) {
        (this.errors as any)[field] = true;
      }
    });
    setTimeout(() => {
      Object.keys(this.$refs).forEach(field => {
        (this.errors as any)[field] = false;
      });
    }, 4000);
  }

  validateFields(): boolean {
    return Object.keys(this.$refs).every(field => (this.$refs[field] as any).valid);
  }
}
</script>

<style scoped lang="sass">
  .v-input
    width: 100%

  .v-alert
    position: fixed
    top: 5rem
    right: 1rem
</style>
