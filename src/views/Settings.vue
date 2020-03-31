<template>
  <div>
    <h1>Настройки</h1>
    <v-tabs>
      <v-tab>Общие</v-tab>
      <v-tab>Смена пароля</v-tab>
      <v-tab-item>
        <v-form class="mt-4" @submit.prevent="onCommonSubmit">
          <v-text-field
              v-model="phone"
              label="Телефон"
              outlined
              :rules="[rules.required, rules.isPhone, rules.phoneOverflow]"
              ref="phone"
              :error="errors.phone"
              :counter="maxPhoneLength"
              :maxlength="maxPhoneLength"
              :loading="isFetching"
          />
          <v-text-field
              v-model="name"
              label="Имя"
              outlined
              :rules="[rules.required, rules.nameOverflow]"
              ref="name"
              :error="errors.surname"
              :counter="maxNameLength"
              :maxlength="maxNameLength"
              :loading="isFetching"
          />
          <v-text-field
              v-model="surname"
              label="Фамилия"
              outlined
              ref="surname"
              :error="errors.surname"
              :rules="[rules.required, rules.surnameOverflow]"
              :counter="maxSurnameLength"
              :maxlength="maxSurnameLength"
              :loading="isFetching"
          />
          <v-text-field
              v-model="patronymics"
              label="Отчество"
              outlined
              ref="patronymics"
              :rules="[rules.patronymicsOverflow]"
              :error="errors.patronymics"
              :counter="maxPatronymicsLength"
              :maxlength="maxPatronymicsLength"
              :loading="isFetching"
          />
          <v-btn
            type="submit"
            :disabled="hasInfoDifference"
            :loading="isFetching"
          >
            Сохранить
          </v-btn>
        </v-form>
      </v-tab-item>
      <v-tab-item>
        <v-form class="mt-4" @submit.prevent="onPasswordSubmit">
          <v-text-field
              v-model="oldPassword"
              label="Старый пароль"
              outlined
              type="password"
              ref="oldPassword"
              :rules="[rules.required, rules.passwordOverflow]"
              :loading="isFetching"
          />
          <v-text-field
              v-model="newPassword"
              label="Новый пароль"
              outlined
              type="password"
              ref="newPassword"
              :rules="[rules.required, rules.isPasswordMatchRules, rules.passwordOverflow]"
              :loading="isFetching"
          />
          <v-text-field
              v-model="newPasswordConfirmation"
              label="Подтверждение"
              outlined
              type="password"
              ref="newPasswordConfirmation"
              :rules="[rules.required, rules.isPasswordsMatch.bind(this), rules.passwordOverflow]"
              :loading="isFetching"
          />
          <v-btn
              type="submit"
              :disabled="enteredAllPasswordRequirements"
              :loading="isFetching"
          >
            Обновить
          </v-btn>
        </v-form>
      </v-tab-item>
    </v-tabs>
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';
  import {
    PATTERNS,
    SHOW_ALERT,
    MAX_NAME_LENGTH,
    MAX_PHONE_LENGTH,
    MAX_SURNAME_LENGTH,
    MAX_PASSWORD_LENGTH,
    MAX_PATRONYMICS_LENGTH
  } from '@/common/constants';
  import eventBus from '@/common/eventBus';

  @Component({
    name: 'Settings'
  })
  export default class Settings extends Vue {
    name = this.$store.state.user.identity.name;
    surname = this.$store.state.user.identity.surname;
    patronymics = this.$store.state.user.identity.patronymics;
    phone = this.$store.state.user.identity.phone;

    oldPassword = '';
    newPassword = '';
    newPasswordConfirmation = '';

    isFetching = false;

    TIMEOUT_DELAY = 3000;

    maxNameLength = MAX_NAME_LENGTH;
    maxSurnameLength = MAX_SURNAME_LENGTH;
    maxPatronymicsLength = MAX_PATRONYMICS_LENGTH;
    maxPhoneLength = MAX_PHONE_LENGTH;
    maxPasswordLength = MAX_PASSWORD_LENGTH;

    errors = {
      name: false,
      surname: false,
      patronymics: false,
      phone: false,
      oldPassword: false,
      newPassword: false,
      newPasswordConfirmation: false
    };

    get commonSettingsRefs(): {name: any; surname: any; patronymics: any; phone: any} {
      return {
        name: this.$refs.name,
        surname: this.$refs.surname,
        patronymics: this.$refs.patronymics,
        phone: this.$refs.phone
      };
    }

    get passwordSettingsRefs(): {oldPassword: any; newPassword: any; newPasswordConfirmation: any} {
      return {
        oldPassword: this.$refs.oldPassword,
        newPassword: this.$refs.newPassword,
        newPasswordConfirmation: this.$refs.newPasswordConfirmation
      };
    }

    rules: {[key: string]: (v: string) => boolean | string} = {
      required: (v: string) => !!v || 'Поле не должно быть пустым.',
      isPhone: (v: string) => PATTERNS.PHONE().test(v) || 'Телефон введен некорректно.',
      isPasswordMatchRules: (v: string) => v.length > 5 || 'Пароль должен содержать минимум 6 символов',
      isPasswordsMatch(v: string) {
        return v === (this.newPassword as any) || 'Пароли не совпадают.';
      },
      nameOverflow: (v: string) => v.length <= MAX_NAME_LENGTH || `Имя должно быть меньше ${MAX_NAME_LENGTH} символов.`,
      surnameOverflow: (v: string) => v.length <= MAX_SURNAME_LENGTH || `Фамилия должна быть меньше ${MAX_SURNAME_LENGTH} символов.`,
      patronymicsOverflow: (v: string) => v.length <= MAX_PATRONYMICS_LENGTH || `Отчество должно быть меньше ${MAX_PATRONYMICS_LENGTH} символов.`,
      phoneOverflow: (v: string) => v.length <= MAX_PHONE_LENGTH || `Телефон должен быть меньше ${MAX_PHONE_LENGTH} символов.`,
      passwordOverflow: (v: string) => v.length <= MAX_PASSWORD_LENGTH || `Пароль должен быть меньше ${MAX_PASSWORD_LENGTH} символов.`
    };

    get hasInfoDifference() {
      const newData = {
        phone: this.phone,
        name: this.name,
        surname: this.surname,
        patronymics: this.patronymics
      };

      return this.$_.isEqual(newData, this.$store.getters['user/userData']);
    }

    get enteredAllPasswordRequirements() {
      return !Boolean(this.oldPassword && this.newPassword && this.newPasswordConfirmation);
    }

    get userPhone() {
      return this.$store.state['user'].identity.phone;
    }

    async onCommonSubmit() {
      const isValid = this.validateFields(this.commonSettingsRefs);

      if(!isValid) {
        eventBus.$emit(SHOW_ALERT, 'Заполните все поля правильными значениями!', {
          type: 'error'
        });
        this.triggerAllFields(this.commonSettingsRefs);
        return;
      }

      this.isFetching = true;

      if(this.userPhone !== this.phone) {
        const exists = await this.isUserExists({ phone: this.phone })
                                 .then(response => response.data)
                                 .catch(err => ({ error: err.response?.data?.message }));

        if(this.$_.isPlainObject(exists) && exists.error) {
          this.isFetching = false;
          eventBus.$emit(SHOW_ALERT, exists.error, {
            type: 'error'
          });
          return;
        }

        if(exists) {
          this.isFetching = false;
          this.errors.phone = true;
          eventBus.$emit(SHOW_ALERT, 'Пользователь с таким телефоном уже существует.', {
            type: 'error'
          });
          setTimeout(() => {
            this.errors.phone = false;
          }, this.TIMEOUT_DELAY);
          return;
        }
      }

      await this.$store.dispatch('user/updateCommonInfo', {
        phone: this.phone,
        name: this.name,
        surname: this.surname,
        patronymics: this.patronymics
      })
        .then(({ message }) => eventBus.$emit(SHOW_ALERT, message, {
          type: 'success'
        }))
        .catch(({ message }) => eventBus.$emit(SHOW_ALERT, message, {
          type: 'error'
        }));

      this.isFetching = false;
    }

    async onPasswordSubmit() {
      const isValid = this.validateFields(this.passwordSettingsRefs);

      if(!isValid) {
        eventBus.$emit(SHOW_ALERT, 'Заполните все поля правильными значениями!', {
          type: 'error'
        });
        this.triggerAllFields(this.passwordSettingsRefs);
        return;
      }

      this.isFetching = true;

      await this.$api.user.put('/password', {
        phone: this.userPhone,
        oldPassword: this.oldPassword,
        newPassword: this.newPassword,
        newPasswordConfirmation: this.newPasswordConfirmation
      })
        .then((response: any) => eventBus.$emit(SHOW_ALERT, response.data?.message, {
        type: 'success'
      }))
        .catch((err: any) => eventBus.$emit(SHOW_ALERT, err.response?.data?.message, {
          type: 'error'
        }));

      this.isFetching = false;
    }

    private triggerAllFields(fields: any) {
      Object.keys(fields).forEach(field => {
        if(!(fields[field]as any).valid) {
          (this.errors as any)[field] = true;
        }
      });
      setTimeout(() => {
        Object.keys(fields).forEach(field => {
          (this.errors as any)[field] = false;
        });
      }, this.TIMEOUT_DELAY);
    }

    private validateFields(fields: object): boolean {
      return Object.keys(fields).every(field => (this.$refs[field] as any).valid);
    }

    private async isUserExists({ phone }: {phone: string}) {
      return await this.$api.auth.get('/exists', {
        params:{
          phone
        }
      });
    }
  }
</script>

<style scoped>

</style>
