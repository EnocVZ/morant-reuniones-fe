<script setup>
import avatar1 from '@images/avatars/avatar-14.png'

const accountData = {
  avatarImg: avatar1,
  firstName: '',
  lastName: '',
  email: '',
  org: '',
  phone: '',
  address: '',
  state: '',
  zip: '',
  country: '',
  language: '',
  timezone: '',
  currency: '',
}

const refInputEl = ref()
const isConfirmDialogOpen = ref(false)
const accountDataLocal = ref(structuredClone(accountData))
const isAccountDeactivated = ref(false)
const validateAccountDeactivation = [v => !!v || 'Por favor confirme la desactivación de la cuenta.']

const resetForm = () => {
  accountDataLocal.value = structuredClone(accountData)
}

const changeAvatar = file => {
  const fileReader = new FileReader()
  const { files } = file.target
  if (files && files.length) {
    fileReader.readAsDataURL(files[0])
    fileReader.onload = () => {
      if (typeof fileReader.result === 'string')
        accountDataLocal.value.avatarImg = fileReader.result
    }
  }
}

// reset avatar image
const resetAvatar = () => {
  accountDataLocal.value.avatarImg = accountData.avatarImg
}

const timezones = [
  '(GMT-11:00) International Date Line West',
  '(GMT-11:00) Midway Island',
  '(GMT-10:00) Hawaii',
  '(GMT-09:00) Alaska',
  '(GMT-08:00) Pacific Time (US & Canada)',
  '(GMT-08:00) Tijuana',
  '(GMT-07:00) Arizona',
  '(GMT-07:00) Chihuahua',
  '(GMT-07:00) La Paz',
  '(GMT-07:00) Mazatlan',
  '(GMT-07:00) Mountain Time (US & Canada)',
  '(GMT-06:00) Central America',
  '(GMT-06:00) Central Time (US & Canada)',
  '(GMT-06:00) Guadalajara',
  '(GMT-06:00) Mexico City',
  '(GMT-06:00) Monterrey',
  '(GMT-06:00) Saskatchewan',
  '(GMT-05:00) Bogota',
  '(GMT-05:00) Eastern Time (US & Canada)',
  '(GMT-05:00) Indiana (East)',
  '(GMT-05:00) Lima',
  '(GMT-05:00) Quito',
  '(GMT-04:00) Atlantic Time (Canada)',
  '(GMT-04:00) Caracas',
  '(GMT-04:00) La Paz',
  '(GMT-04:00) Santiago',
  '(GMT-03:30) Newfoundland',
  '(GMT-03:00) Brasilia',
  '(GMT-03:00) Buenos Aires',
  '(GMT-03:00) Georgetown',
  '(GMT-03:00) Greenland',
  '(GMT-02:00) Mid-Atlantic',
  '(GMT-01:00) Azores',
  '(GMT-01:00) Cape Verde Is.',
  '(GMT+00:00) Casablanca',
  '(GMT+00:00) Dublin',
  '(GMT+00:00) Edinburgh',
  '(GMT+00:00) Lisbon',
  '(GMT+00:00) London',
]

const currencies = [
  'USD',
  'EUR',
  'GBP',
  'AUD',
  'BRL',
  'CAD',
  'CNY',
  'CZK',
  'DKK',
  'HKD',
  'HUF',
  'INR',
]
</script>

<template>
  <VRow>
    <VCol cols="12">
      <VCard title="Detalles del perfil">
        <VCardText class="d-flex">
          <!-- 👉 Avatar -->
          <VAvatar
            rounded
            size="100"
            class="me-6"
            :image="accountDataLocal.avatarImg"
          />

          <!-- 👉 Upload Photo -->
          <form class="d-flex flex-column justify-center gap-4">
            <div class="d-flex flex-wrap gap-2">
              <VBtn
                color="primary primary2"
                @click="refInputEl?.click()"
              >
                <VIcon
                  icon="tabler-cloud-upload"
                  class="d-sm-none"
                />
                <span class="d-none d-sm-block">Subir foto</span>
              </VBtn>

              <input
                ref="refInputEl"
                type="file"
                name="file"
                accept=".jpeg,.png,.jpg,GIF"
                hidden
                @input="changeAvatar"
              >

              <VBtn
                type="reset"
                color="secondary"
                variant="tonal"
                @click="resetAvatar"
              >
                <span class="d-none d-sm-block">Reiniciar</span>
                <VIcon
                  icon="tabler-refresh"
                  class="d-sm-none"
                />
              </VBtn>
            </div>

            <p class="text-body-1 mb-0">
              JPG, GIF o PNG permitidos. Tamaño máximo de 800K
            </p>
          </form>
        </VCardText>

        <VDivider />

        <VCardText class="pt-2">
          <!-- 👉 Form -->
          <VForm class="mt-6">
            <VRow>
              <!-- 👉 First Name -->
              <VCol
                md="6"
                cols="12"
              >
                <AppTextField
                  v-model="accountDataLocal.firstName"
                  placeholder="Escriba su nombre"
                  label="Nombre completo"
                  class="borde-inp"
                />
              </VCol>

              <!-- 👉 Last Name -->
              <VCol
                md="6"
                cols="12"
              >
                <AppTextField 
                  v-model="accountDataLocal.lastName"
                  placeholder="Escriba su apellido"
                  label="Apellidos"
                />
              </VCol>

              <!-- 👉 Email -->
              <VCol
                cols="12"
                md="6"
              >
                <AppTextField
                  v-model="accountDataLocal.email"
                  label="Correo"
                  placeholder="correo@gmail.com"
                  type="email"
                />
              </VCol>

              <!-- 👉 Organization -->
              <VCol
                cols="12"
                md="6"
              >
                <AppTextField
                  v-model="accountDataLocal.org"
                  label="Cargo"
                  placeholder="Escriba su cargo"
                />
              </VCol>

              <!-- 👉 Phone -->
              <VCol
                cols="12"
                md="6"
              >
                <AppTextField
                  v-model="accountDataLocal.phone"
                  label="Número de teléfono"
                  placeholder="+1 (917) 543-9876"
                />
              </VCol>

              <!-- 👉 Address -->
              <VCol
                cols="12"
                md="6"
              >
                <AppTextField
                  v-model="accountDataLocal.address"
                  label="Dirreción"
                  placeholder="Escriba su dirección"
                />
              </VCol>

              <!-- 👉 State -->
              <VCol
                cols="12"
                md="6"
              >
                <AppTextField
                  v-model="accountDataLocal.state"
                  label="Estado"
                  placeholder=""
                />
              </VCol>

              <!-- 👉 Zip Code -->
              <VCol
                cols="12"
                md="6"
              >
                <AppTextField
                  v-model="accountDataLocal.zip"
                  label="Código postal"
                  placeholder="10001"
                />
              </VCol>

              <!-- 👉 Country -->
              <!-- <VCol
                cols="12"
                md="6"
              >
                <AppSelect
                  v-model="accountDataLocal.country"
                  label="País"
                  :items="['México']"
                  placeholder="Seleccionar país"
                />
              </VCol> -->

              <!-- 👉 Language -->
              <!-- <VCol
                cols="12"
                md="6"
              >
                <AppSelect
                  v-model="accountDataLocal.language"
                  label="Idioma"
                  placeholder="Seleccione el idioma"
                  :items="['English', 'Spanish', 'Arabic', 'Hindi', 'Urdu']"
                />
              </VCol> -->

              <!-- 👉 Timezone -->
              <!-- <VCol
                cols="12"
                md="6"
              >
                <AppSelect
                  v-model="accountDataLocal.timezone"
                  label="Zona horaria"
                  placeholder="Selecciona la zona horaria"
                  :items="timezones"
                  :menu-props="{ maxHeight: 200 }"
                />
              </VCol> -->

              <!-- 👉 Currency -->
              <!-- <VCol
                cols="12"
                md="6"
              >
                <AppSelect
                  v-model="accountDataLocal.currency"
                  label="Divisa"
                  placeholder="Seleccione el tipo de moneda"
                  :items="currencies"
                  :menu-props="{ maxHeight: 200 }"
                />
              </VCol> -->

              <!-- 👉 Form Actions -->
              <VCol
                cols="12"
                class="d-flex flex-wrap gap-4"
                
              >
                <VBtn color="success">Guardar cambios</VBtn>

                <VBtn
                  color="secondary"
                  variant="tonal"
                  type="reset"
                  @click.prevent="resetForm"
                >
                  Reiniciar
                </VBtn>
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
      </VCard>
    </VCol>

    <VCol cols="12">
      <!-- 👉 Delete Account -->
      <VCard title="Borrar cuenta">
        <VCardText>
          <!-- 👉 Checkbox and Button  -->
          <div>
            <VCheckbox
              v-model="isAccountDeactivated"
              :rules="validateAccountDeactivation"
              label="Confirmo la desactivación de mi cuenta"
            />
          </div>

          <VBtn
            :disabled="!isAccountDeactivated"
            color="error"
            class="mt-3"
            @click="isConfirmDialogOpen = true"
          >
            Desactivar cuenta
          </VBtn>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>

  <!-- Confirm Dialog -->
  <ConfirmDialog
    v-model:isDialogVisible="isConfirmDialogOpen"
    confirmation-question="Are you sure you want to deactivate your account?"
    confirm-title="Deactivated!"
    confirm-msg="Your account has been deactivated successfully."
    cancel-title="Cancelled"
    cancel-msg="Account Deactivation Cancelled!"
  />
</template>

<style lang="scss">
  .primary2{
    background-color: #b48d57 !important;
    color: #fff !important;
  }

  .borde-inp:focus {
    border: 1px solid #b48d57 !important;
  }
</style>
