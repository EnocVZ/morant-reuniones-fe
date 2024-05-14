<!-- ❗Errors in the form are set on line 60 -->
<script setup>
import { VForm } from 'vuetify/components/VForm'
import AuthProvider from '@/views/pages/authentication/AuthProvider.vue'
import { useGenerateImageVariant } from '@core/composable/useGenerateImageVariant'
import authV2LoginIllustrationBorderedDark from '@images/pages/auth-v2-login-illustration-bordered-dark.png'
import authV2LoginIllustrationBorderedLight from '@images/pages/auth-v2-login-illustration-bordered-light.png'
import authV2LoginIllustrationDark from '@images/pages/auth-v2-login-illustration-dark.png'
import authV2LoginIllustrationLight from '@images/pages/auth-v2-login-illustration-light.png'
import logosdevDark from '@images/logos/logoEdomexDark.png'
import logosdevLighk from '@images/logos/logoEdomexLight.png'
import iconDark from '@images/logos/flor 1.png'
import iconLighk from '@images/logos/flor 1.png'
import authV2MaskDark from '@images/logos/textura.png'
import authV2MaskLight from '@images/logos/textura.png'
import { VNodeRenderer } from '@layouts/components/VNodeRenderer'
import { themeConfig } from '@themeConfig'
import { $apiService } from '@/utils/api-service.js'
import menuOpciones from '../navigation/vertical/catalogos-inbox';
import oficinaServices from '@/services/oficina/oficina-services'

const authThemeImg = useGenerateImageVariant(authV2LoginIllustrationLight, authV2LoginIllustrationDark, authV2LoginIllustrationBorderedLight, authV2LoginIllustrationBorderedDark, true)
const authThemeMask = useGenerateImageVariant(authV2MaskLight, authV2MaskDark)
const imagenlogin = useGenerateImageVariant(logosdevDark, logosdevLighk, true)
const iconLogo = useGenerateImageVariant(iconDark, iconLighk, true)

const Oficinas = ref([]);
const listaOficinas = ref([]);
const isSelectOficina = ref(false);

definePage({
  meta: {
    layout: 'blank',
    unauthenticatedOnly: true,
  },
})

const isPasswordVisible = ref(false)
const route = useRoute()
const router = useRouter()
var isSnackbarVisible = false
// const ability = useAbility()

const errors = ref({
  email: undefined,
  password: undefined,
})

const refVForm = ref()

const credentials = ref({
  email: 'super',
  password: '123456',
})

const rememberMe = ref(false)

const _Oficinas = async () => {
  try {
    let res = await oficinaServices.getOficinas().then(data => data)
    if (res?.data) {
      Oficinas.value = res.data
    }
  } catch (error) {
    console.log(error);
  }
}

const logout = async () => {
  const userData = useCookie("userData");

  useCookie("accessToken").value = null;
  useCookie("userName").value = null;
  useCookie("userId").value = null;
  useCookie("permisos").value = null;
  useCookie('idOficina').value = null;
  useCookie('idTipoPermiso').value = null;
  userData.value = null;
  useCookie("userAbilityRules").value = null;
}

const selectOficina = async (oficina) => {
  logout()

  nextTick(async () => {
    showNotification();
    // Realiza las operaciones necesarias al seleccionar una oficina
    console.log(listaOficinas.value, "Oficina seleccionada:", oficina);
    // Cierra el modal
    isSelectOficina.value = false;

    await newLogin(oficina.id)
    window.location.reload();

    // Muestra una notificación
  });
}

// Función para mostrar una notificación
function showNotification() {
  // Aquí puedes implementar la lógica para mostrar una notificación
  console.log("Notificación mostrada");
}

const newLogin = async (id) => {
  try {
    let res = await $api('api/Auth/Login', {
      method: 'POST',
      body: {
        userName: credentials.value.email,
        password: credentials.value.password,
        oficinas: id
      },
      onResponseError({ response }) {
        errors.value = response._data.errors
      },
    })

    const { userName, userId, token, permisos, nombreOficina, tipoUsuario, usuarioOficinas, idTipoPermiso } = res

    let permisosMenu = [];
    let tipoUser = tipoUsuario.value;
    if (res.permisos[0].vista === 'Todas') {
      permisosMenu = menuOpciones;
    } else {
      permisosMenu = menuOpciones.filter(option => {
        if(tipoUser !== 1 && option.title ==="Catalogos"){
          option.children = option.children.filter(menuHijos => menuHijos.title !== "Configuraciones");
        }
        return res.permisos.some(permiso => permiso.vista === option.title);
      });
    }

    useCookie('inicioSesion').value = new Date().getTime()
    useCookie('userName').value = userName
    useCookie('userId').value = userId
    useCookie('accessToken').value = token
    useCookie('permisos').value = permisos
    useCookie('nombreOficina').value = nombreOficina
    useCookie('tipoUsuario').value = tipoUsuario
    useCookie('idOficina').value = usuarioOficinas
    useCookie('idTipoPermiso').value = idTipoPermiso
    sessionStorage.setItem('accessToken', token)
    localStorage.setItem('menu', JSON.stringify(permisosMenu));

  } catch (error) {
    console.log(error);
  }
}


const login2 = async () => {
  try {
    let res = await $api('api/Auth/Login', {
      method: 'POST',
      body: {
        userName: credentials.value.email,
        password: credentials.value.password,
        oficinas: 0
      },
      onResponseError({ response }) {
        errors.value = response._data.errors
      },
    })//await $apiService.post('api/Auth/Login',{userName:credentials.value.email,password:credentials.value.password});

    console.log(res);

    const { userName, userId, token, permisos, nombreOficina, tipoUsuario, usuarioOficinas, idTipoPermiso } = res

    let permisosMenu = [];
    let tipoUser = tipoUsuario.value;
    if (res.permisos[0].vista === 'Todas') {
      permisosMenu = menuOpciones;
    } else {
      permisosMenu = menuOpciones.filter(option => {
        if(tipoUser !== 1 && option.title ==="Catalogos"){
          option.children = option.children.filter(menuHijos => menuHijos.title !== "Configuraciones");
        }
        return res.permisos.some(permiso => permiso.vista === option.title);
      });
    }
    useCookie('inicioSesion').value = new Date().getTime()
    useCookie('userName').value = userName
    useCookie('userId').value = userId
    useCookie('accessToken').value = token
    useCookie('permisos').value = permisos
    useCookie('nombreOficina').value = nombreOficina
    useCookie('tipoUsuario').value = tipoUsuario
    useCookie('idOficina').value = usuarioOficinas
    useCookie('idTipoPermiso').value = idTipoPermiso
    sessionStorage.setItem('accessToken', token)
    localStorage.setItem('menu', JSON.stringify(permisosMenu));



    await nextTick(async () => {

      if (useCookie('tipoUsuario').value == "1") {
        if (useCookie('idTipoPermiso').value == 2 || useCookie('idTipoPermiso').value == 3) {
          isSelectOficina.value = true
          await _Oficinas();
        }
        else
          window.location.reload();
      } else {
        window.location.reload();
      }

      // window.location.reload();
      //Recargar la pagina
      // router.push({name:'apps-email'})
    })
  } catch (err) {
    console.error(err)
  }
}

const login = async () => {
  try {
    const res = await $api('/auth/login', {
      method: 'POST',
      body: {
        email: credentials.value.email,
        password: credentials.value.password,
      },
      onResponseError({ response }) {
        errors.value = response._data.errors
      },
    })

    const { accessToken, userData, userAbilityRules } = res

    useCookie('userAbilityRules').value = userAbilityRules
    ability.update(userAbilityRules)
    useCookie('userData').value = userData
    useCookie('accessToken').value = accessToken
    await nextTick(() => {
      router.replace(route.query.to ? String(route.query.to) : '/')
    })
  } catch (err) {
    console.error(err)
  }
}

const onSubmit = () => {
  refVForm.value?.validate().then(({ valid: isValid }) => {
    if (isValid)
      login2()
  })
}
</script>

<template>
  <VRow no-gutters class="auth-wrapper bg-surface">
    <VCol lg="8" class="d-none d-lg-flex">
      <div class="position-relative bg-background rounded-lg w-100 ma-8 me-0">
        <div class="d-flex align-center justify-center w-100 h-100">
          <VImg width="700" max-width="705" :src="imagenlogin" class="auth-illustration mt-4 mb-2" />
        </div>

        <VImg :src="authThemeMask" class="auth-footer-mask" />
      </div>
    </VCol>

    <VCol cols="12" lg="4" class="auth-card-v2 d-flex align-center justify-center">
      <VCard flat :max-width="500" class="mt-12 mt-sm-0 pa-4">
        <VCardText>
          <!-- <VNodeRenderer
            :nodes="themeConfig.app.logo"
            class="mb-6"
          /> -->
          <div>
            <VImg :src="iconLogo" class="mb-3" max-width="45" />
          </div>
          <h4 class="text-h4 mb-1">
            Bienvenidos a <span class="text-capitalize text-primary"> {{ themeConfig.app.title }} </span> 👋🏻
          </h4>
          <p class="mb-0">
            Inicie sesión en su cuenta y comience la aventura.
          </p>
        </VCardText>
        <!-- <VCardText>
          <VAlert
            color="primary"
            variant="tonal"
          >
            <p class="text-sm mb-2">
              Admin Email: <strong>admin@demo.com</strong> / Pass: <strong>admin</strong>
            </p>
            <p class="text-sm mb-0">
              Client Email: <strong>client@demo.com</strong> / Pass: <strong>client</strong>
            </p>
          </VAlert>
        </VCardText> -->
        <VCardText>
          <VForm ref="refVForm" @submit.prevent="onSubmit">
            <VRow>
              <!-- email -->
              <VCol cols="12">
                <AppTextField v-model="credentials.email" label="Correo electrónico o nombre de usuario"
                  placeholder="Introduce tu correo electrónico o nombre de usuario" type="text" autofocus
                  :rules="[requiredValidator]" :error-messages="errors.email" />
              </VCol>

              <!-- password -->
              <VCol cols="12">
                <AppTextField v-model="credentials.password" label="Contraseña" placeholder="············"
                  :rules="[requiredValidator]" :type="isPasswordVisible ? 'text' : 'password'"
                  :error-messages="errors.password"
                  :append-inner-icon="isPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'"
                  @click:append-inner="isPasswordVisible = !isPasswordVisible" />

                <div class="d-flex align-center flex-wrap justify-space-between mt-1 mb-4">
                  <VCheckbox v-model="rememberMe" label="Acuérdate de mí" />
                  <!-- <RouterLink
                    class="text-primary ms-2 mb-1"
                    :to="{ name: 'forgot-password' }"
                  >
                    Forgot Password?
                  </RouterLink> -->
                </div>

                <VBtn block type="submit">
                  Iniciar Sesión
                </VBtn>
              </VCol>

              <!-- create account -->
              <!-- <VCol
                cols="12"
                class="text-center"
              >
                <span>New on our platform?</span>
                <RouterLink
                  class="text-primary ms-2"
                  :to="{ name: 'register' }"
                >
                  Create an account
                </RouterLink> 
              </VCol>-->

              <VCol cols="12" class="d-flex align-center">
                <VDivider />
                <!-- <span class="mx-4">or</span> -->
                <VDivider />
              </VCol>

              <!-- auth providers -->
              <VCol cols="12" class="text-center">
                <!-- <AuthProvider /> -->
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>

  <VDialog v-model="isSelectOficina" class="v-dialog-sm" persistent>
    <VCard title="Oficina">
      <VCardText>
        <VTable height="450" class="text-no-wrap">
          <thead>
            <tr>
              <th class="text-uppercase">Oficinas</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="oficina in Oficinas" :key="oficina.id" @click="selectOficina(oficina)" class="cursor-pointer">
              <td>{{ oficina.nombre }}</td>
            </tr>
          </tbody>
        </VTable>
      </VCardText>
      <VCardText class="d-flex justify-end flex-wrap gap-3">
        <!-- <VBtn variant="tonal" color="secondary" @click="isSelectOficina = false">Close</VBtn> -->
      </VCardText>
    </VCard>
  </VDialog>


  <VSnackbar v-model="isSnackbarVisible" vertical color="error" variant="tonal" location="top" :timeout="60000">
    {{ useCookie('datosUltraMsg').value.error }}
        </VSnackbar>
</template>

<style lang="scss">
@use "@core/scss/template/pages/page-auth.scss";
</style>
