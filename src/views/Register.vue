<template>
  <v-container>
    <h1 class="heading text-center">Регистрация</h1>
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
              :loading="isFetching"
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
              :loading="isFetching"
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
              :loading="isFetching"
          />
          <v-text-field
              v-model="phoneText"
              outlined
              label="Телефон"
              :rules="[rules.required, rules.isPhone, rules.phoneOverflow]"
              ref="phone"
              :error="errors.phone"
              :counter="maxPhoneLength"
              :maxlength="maxPhoneLength"
              :loading="isFetching"
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
              :loading="isFetching"
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
              :loading="isFetching"
          />
          <v-btn
              outlined
              type="submit"
              :loading="isFetching"
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
    MAX_PASSWORD_LENGTH,
    MAX_PHONE_LENGTH
  } from '@/common/constants';

  @Component({
    name: 'Register'
  })
  export default class Register extends Vue {
    nameText = '';
    surnameText = '';
    patronymicsText = '';
    phoneText = '';
    passwordText = '';
    passwordConfirmationText = '';
    passwordHint = 'Пароль должен содержать минимум 6 символов';
    errorText = '';
    showError = false;
    isFetching = false;

    maxNameLength = MAX_NAME_LENGTH;
    maxSurnameLength = MAX_SURNAME_LENGTH;
    maxPatronymicsLength = MAX_PATRONYMICS_LENGTH;
    maxPhoneLength = MAX_PHONE_LENGTH;
    maxPasswordLength = MAX_PASSWORD_LENGTH;

    TIMEOUT_DELAY = 3000;

    errors = {
      name: false,
      surname: false,
      patronymics: false,
      phone: false,
      password: false,
      passwordConfirmation: false
    };

    rules: {[key: string]: (v: string) => boolean | string} = {
      required: (v: string) => !!v || 'Поле не должно быть пустым.',
      isPhone: (v: string) => PATTERNS.PHONE().test(v) || 'Телефон введен некорректно.',
      isPasswordMatchRules: (v: string) => v.length > 5 || 'Пароль должен содержать минимум 6 символов',
      isPasswordsMatch(v: string) {
        return v === (this.passwordText as any) || 'Пароли не совпадают.';
      },
      nameOverflow        : (v: string) => v.length <= MAX_NAME_LENGTH || `Имя должно быть меньше ${MAX_NAME_LENGTH} символов.`,
      surnameOverflow     : (v: string) => v.length <= MAX_SURNAME_LENGTH || `Фамилия должна быть меньше ${MAX_SURNAME_LENGTH} символов.`,
      patronymicsOverflow : (v: string) => v.length <= MAX_PATRONYMICS_LENGTH || `Отчество должно быть меньше ${MAX_PATRONYMICS_LENGTH} символов.`,
      phoneOverflow       : (v: string) => v.length <= MAX_PHONE_LENGTH || `Телефон должен быть меньше ${MAX_PHONE_LENGTH} символов.`,
      passwordOverflow    : (v: string) => v.length <= MAX_PASSWORD_LENGTH || `Пароль должен быть меньше ${MAX_PASSWORD_LENGTH} символов.`
    };

    async isUserExists({ phone }: {phone: string}) {
      return await this.$api.auth.get('/exists', {
        params:{
          phone
        }
      });
    }

    async register() {
      const isValid = this.validateFields();

      if (!isValid) {
        this.toggleAlert('Заполните все поля правильными значениями!');
        this.triggerAllFields();
        return;
      }

      this.isFetching = true;
      const exists = await this.isUserExists({ phone: this.phoneText })
                               .then(response => response.data)
                               .catch(err => ({ error: err.response?.data?.message }));

      if(this.$_.isPlainObject(exists) && exists.error) {
        this.isFetching = false;
        this.toggleAlert(exists.error);
        return;
      }

      if(exists) {
        this.isFetching = false;
        this.errors.phone = true;
        this.toggleAlert('Пользователь с таким телефоном уже существует.');
        setTimeout(() => {
          this.errors.phone = false;
        }, this.TIMEOUT_DELAY);
        return;
      }

      await this.$store.dispatch('user/register', {
        phone: this.phoneText,
        name: this.nameText,
        surname: this.surnameText,
        patronymics: this.patronymicsText,
        password: this.passwordText,
        passwordConfirmation: this.passwordConfirmationText
      }).catch(({ message }) => this.toggleAlert(message));
      this.isFetching = false;
      await this.$router.push('/');
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
      }, this.TIMEOUT_DELAY);
    }

    toggleAlert(text = 'Что-то пошло не так. Извините.') {
      this.showError = true;
      this.errorText = text;
      setTimeout(() => {
        this.showError = false;
      }, this.TIMEOUT_DELAY);
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
