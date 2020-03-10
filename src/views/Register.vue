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
        <v-form
            lazy-validation
            @submit.prevent="register"
            class="d-flex flex-column align-center"
        >
          <v-text-field
              v-model="nameText"
              outlined
              label="Имя"
              :rules="[rules.required, rules.nameOverflow]"
              ref="name"
              :error="errors.name"
              :counter="maxNameLength"
              :maxlength="maxNameLength"
          />
          <v-text-field
              v-model="surnameText"
              outlined
              label="Фамилия"
              :rules="[rules.required, rules.surnameOverflow]"
              ref="surname"
              :error="errors.surname"
              :counter="maxSurnameLength"
              :maxlength="maxSurnameLength"
          />
          <v-text-field
              v-model="patronymicsText"
              outlined
              label="Отчество"
              ref="patronymics"
              :rules="[rules.patronymicsOverflow]"
              :error="errors.patronymics"
              :counter="maxPatronymicsLength"
              :maxlength="maxPatronymicsLength"
          />
          <v-text-field
              v-model="emailText"
              outlined
              label="Email"
              :rules="[rules.required, rules.isEmail, rules.emailOverflow]"
              ref="email"
              :error="errors.email"
              :counter="maxEmailLength"
              :maxlength="maxEmailLength"
          />
          <v-text-field
              v-model="passwordText"
              outlined
              label="Пароль"
              type="password"
              :hint="passwordHint"
              :rules="[rules.required, rules.isPasswordMatchRules, rules.passwordOverflow]"
              ref="password"
              :error="errors.password"
              :counter="maxPasswordLength"
              :maxlength="maxPasswordLength"
          />
          <v-text-field
              v-model="passwordConfirmationText"
              outlined
              label="Повторите пароль"
              type="password"
              :rules="[rules.required, rules.isPasswordsMatch.bind(this), rules.passwordOverflow]"
              ref="passwordConfirmation"
              :error="errors.passwordConfirmation"
              :counter="maxPasswordLength"
              :maxlength="maxPasswordLength"
          />
          <v-btn
              outlined
              type="submit"
          >
            Зарегистрироваться
          </v-btn>
        </v-form>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';
  import { namespace } from 'vuex-class';
  import {
    PATTERNS,
    MAX_NAME_LENGTH,
    MAX_SURNAME_LENGTH,
    MAX_PATRONYMICS_LENGTH,
    MAX_EMAIL_LENGTH,
    MAX_PASSWORD_LENGTH
  } from '@/common/constants';

  const user = namespace('user');

  @Component({
    name: 'Register'
  })
  export default class Register extends Vue {
    nameText = '';
    surnameText = '';
    patronymicsText = '';
    emailText = '';
    passwordText = '';
    passwordConfirmationText = '';
    passwordHint = 'Пароль должен содержать минимум 6 символов';
    errorText = '';
    showError = false;
    maxNameLength = MAX_NAME_LENGTH;
    maxSurnameLength = MAX_SURNAME_LENGTH;
    maxPatronymicsLength = MAX_PATRONYMICS_LENGTH;
    maxEmailLength = MAX_EMAIL_LENGTH;
    maxPasswordLength = MAX_PASSWORD_LENGTH;
    errors = {
      name: false,
      surname: false,
      patronymics: false,
      email: false,
      password: false,
      passwordConfirmation: false
    };

    rules: {[key: string]: (v: string) => boolean | string} = {
      required: (v: string) => !!v || 'Поле не должно быть пустым.',
      isEmail: (v: string) => PATTERNS.email().test(v) || 'Email введен некорректно.',
      isPasswordMatchRules: (v: string) => v.length > 5 || 'Пароль должен содержать минимум 6 символов',
      isPasswordsMatch(v: string) {
        // @ts-ignore
        return v === (this.passwordText as string) || 'Пароли не совпадают.';
      },
      nameOverflow: (v: string) => v.length <= MAX_NAME_LENGTH || `Имя должно быть меньше ${MAX_NAME_LENGTH} символов.`,
      surnameOverflow: (v: string) => v.length <= MAX_SURNAME_LENGTH || `Фамилия должна быть меньше ${MAX_SURNAME_LENGTH} символов.`,
      patronymicsOverflow: (v: string) => v.length <= MAX_PATRONYMICS_LENGTH || `Отчество должно быть меньше ${MAX_PATRONYMICS_LENGTH} символов.`,
      emailOverflow: (v: string) => v.length <= MAX_EMAIL_LENGTH || `Email должен быть меньше ${MAX_EMAIL_LENGTH} символов.`,
      passwordOverflow: (v: string) => v.length <= MAX_PASSWORD_LENGTH || `Пароль должен быть меньше ${MAX_PASSWORD_LENGTH} символов.`
    };

    @user.Action
    isUserExists!: (data: { email: string }) => boolean;

    async register() {
      const isValid = this.validateFields();

      console.log(isValid);
      if (!isValid) {
        this.toggleAlert('Заполните все поля правильными значениями!');
        this.triggerAllFields();
        return;
      }
      await this.isUserExists({ email: this.emailText });
      console.log('Hi!');
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

    toggleAlert(text = 'Что-то пошло не так. Извините.') {
      this.showError = true;
      this.errorText = text;
      setTimeout(() => {
        this.showError = false;
      }, 3000);
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
