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
              v-model.trim="loginText"
              outlined
              label="Телефон"
              :rules="[rules.required, rules.isPhone, rules.phoneOverflow]"
              :maxlength="maxPhoneLength"
              type="tel"
              ref="phone"
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
          <v-btn outlined type="submit" :loading="loginButtonLoading">Войти</v-btn>
        </v-form>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import {
  PATTERNS,
  SHOW_ALERT,
  MAX_PHONE_LENGTH,
  MAX_PASSWORD_LENGTH
} from '@/common/constants';
import eventBus from '@/common/eventBus';

@Component({
  name: 'Login'
})
export default class Login extends Vue {
  loginText = '';
  passwordText = '';
  errorText = '';

  showError = false;
  maxPhoneLength = MAX_PHONE_LENGTH;
  maxPasswordLength = MAX_PASSWORD_LENGTH;
  loginButtonLoading = false;

  errors = {
    phone: false,
    password: false
  };

  rules = {
    required: (v: string) => !!v || 'Поле не должно быть пустым.',
    isPhone: (v: string) => PATTERNS.ONLY_DIGITS().test(v) || 'Телефон содержит неверные символы. Вводите только цифры.',
    phoneOverflow: (v: string) => v.length <= MAX_PHONE_LENGTH || `Телефон должен быть меньше ${MAX_PHONE_LENGTH} символов.`,
    passwordOverflow: (v: string) => v.length <= MAX_PASSWORD_LENGTH || `Пароль должен быть меньше ${MAX_PASSWORD_LENGTH} символов.`
  };

  async authorizeUser(data: any): Promise<{statusCode: number; message: string}> {
    return this.$store.dispatch('user/authorizeUser', data);
  }

  async login() {
    const isValid = this.validateFields();

    if(!isValid) {
      this.triggerAllFields();
      eventBus.$emit('show');
      eventBus.$emit(SHOW_ALERT, 'Заполните все поля правильными значениями!', {
        type: 'error'
      });
      return;
    }
    this.loginButtonLoading = true;
    await this.authorizeUser({ phone: this.loginText, password: this.passwordText })
              .then(() => this.$router.push('/'))
              .catch(({ message }) => eventBus.$emit(SHOW_ALERT, message, {
                type: 'error'
              }));
    this.loginButtonLoading = false;
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
