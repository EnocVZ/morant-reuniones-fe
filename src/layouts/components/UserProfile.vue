<script setup>
import { PerfectScrollbar } from "vue3-perfect-scrollbar";
import oficinaServices from '@/services/oficina/oficina-services'
import menuOpciones from '../../navigation/vertical/catalogos-inbox'
const router = useRouter();
// const ability = useAbility()

// TODO: Get type from backend
const userData = useCookie("userData");

const userName = useCookie("userName").value + "";

console.log(userName);

const avatar = `${import.meta.env.BASE_URL ?? "/"}images/avatars/avatar-1.png`;
const prueba = `${import.meta.env.BASE_URL ?? "/"
  }images/logos/Back_1_Mesa de trabajo 1.png`;
const firmas = `${import.meta.env.BASE_URL ?? "/"}images/logos/Lista-04.png`;
const actas = `${import.meta.env.BASE_URL ?? "/"}images/logos/back_acta 1.png`;
const personificadores = `${import.meta.env.BASE_URL ?? "/"}images/logos/Personificadores-gris.png`;
const pdfGris = `${import.meta.env.BASE_URL ?? "/"}images/logos/Back_Mesa_2_Gris.png`;
const firmaGris = `${import.meta.env.BASE_URL ?? "/"}images/logos/Actas_Mesa de trabajo 1.png`;
const actaGris = `${import.meta.env.BASE_URL ?? "/"}images/logos/Back--04.png`;
const WordMinuta = `${import.meta.env.BASE_URL ?? "/"}wordTemplates/minuta.docx`;
const WordActa = `${import.meta.env.BASE_URL ?? "/"}wordTemplates/Acta.docx`;
const logout = async () => {
  // Remove "accessToken" from cookie
  useCookie('inicioSesion').value = null
  useCookie("accessToken").value = null;
  useCookie("userName").value = null;
  useCookie("userId").value = null;
  useCookie("permisos").value = null;
  useCookie('nombreOficina').value = null
  useCookie('tipoUsuario').value = null
  useCookie('idOficina').value = null
  useCookie('idTipoPermiso').value = null

  // Remove "userData" from cookie
  userData.value = null;

  // Redirect to login page
  await router.push("/login");

  // ℹ️ We had to remove abilities in then block because if we don't nav menu items mutation is visible while redirecting user to login page

  // Remove "userAbilities" from cookie
  useCookie("userAbilityRules").value = null;

  // Reset ability to initial ability
  // ability.update([])
};

const logout2 = async () => {
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
const refVForm = ref()
const Oficinas = ref([]);
const listaOficinas = ref([]);
const isSelectOficina = ref(false);
const Password = ref("");
const isSelectPassword = ref(false);
const isPasswordVisible = ref(false);
const IdOficina = ref(0);
const errors = ref({
  email: undefined,
  password: undefined,
})
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

const selectOficina = async (oficina) => {
  //logout2()  
  console.log(oficina, "Oficina");
  IdOficina.value = oficina;
  isSelectOficina.value = false;
  isSelectPassword.value = true;
}
const onSubmit = async () => {
  refVForm.value?.validate().then(async ({ valid: isValid }) => {
    if (isValid)
      logout2()
    await newLogin()

  })
}
const CargarOficina = async () => {
  _Oficinas()
  isSelectOficina.value = true;
}
const newLogin = async () => {
  try {
    let res = await $api('api/Auth/Login', {
      method: 'POST',
      body: {
        userName: useCookie("userName").value,
        password: Password.value,
        oficinas: IdOficina.value
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
        if (tipoUser !== 1 && option.title === "Catalogos") {
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
    window.location.reload();
  } catch (error) {
    console.log(error);
  }
}

const userProfileList = [
  { type: "divider" },
  // {
  //   type: 'navItem',
  //   icon: 'tabler-user',
  //   title: 'Perfil',
  //   to: {
  //     name: 'pages-account-settings-tab',
  //     params: { tab: 'account' },
  //   },

  // },
  // {
  //   type: 'navItem',
  //   icon: 'tabler-settings',
  //   title: 'Configuración',
  //   to: {
  //     name: 'apps-user-view-id',
  //     params: { id: 21 },
  //   },
  // },
  // {
  //   type: 'navItem',
  //   icon: 'tabler-credit-card',
  //   title: 'Billing',
  //   to: {
  //     name: 'pages-account-settings-tab',
  //     params: { tab: 'billing-plans' },
  //   },
  //   badgeProps: {
  //     color: 'error',
  //     content: '3',
  //   },
  // },
  // { type: 'divider' },
  // {
  //   type: 'navItem',
  //   icon: 'tabler-currency-dollar',
  //   title: 'Pricing',
  //   to: { name: 'pages-pricing' },
  // },
  // {
  //   type: 'navItem',
  //   icon: 'tabler-help-circle',
  //   title: 'FAQ',
  //   to: { name: 'pages-faq' },
  // },
  { type: "divider" },
  {
    type: "navItem",
    icon: "tabler-logout",
    title: "Salir",
    onClick: logout,
  }
];
nextTick(async () => {

  if (useCookie('tipoUsuario').value == "1") {
    if (useCookie('idTipoPermiso').value == 2 || useCookie('idTipoPermiso').value == 3) {
      userProfileList.push({
        type: "navItem",
        icon: "tabler-arrows-diff",
        title: "Cambiar dependencia",
        onClick: CargarOficina,
      })
    }
  }
})
</script>

<template>
  <img :src="prueba" width="1" height="1" alt="" />
  <img :src="actas" width="1" height="1" alt="" />
  <img :src="firmas" width="1" height="1" alt="" />
  <img :src="personificadores" width="1" height="1" alt="" />
  <img :src="pdfGris" width="1" height="1" alt="" />
  <img :src="firmaGris" width="1" height="1" alt="" />
  <img :src="actaGris" width="1" height="1" alt="" />


  <VBadge v-if="userName" dot location="bottom right" offset-x="3" offset-y="3" color="#ffffff00">
    <!--     
      :color="!userName ? 'primary' : undefined"
      :variant="!userName ? 'tonal' : undefined" -->
    <VAvatar class="cursor-pointer" color="primary" variant="tonal">
      <VIcon color="primary" icon="tabler-user" />

      <!-- SECTION Menu -->
      <VMenu activator="parent" width="230" location="bottom end" offset="14px">
        <VList>
          <VListItem>
            <template #prepend>
              <VListItemAction start>
                <VAvatar color="primary" variant="tonal">
                  <VIcon color="primary" icon="tabler-user" />
                </VAvatar>
                <!-- <VBadge
                  location="bottom right"
                  offset-x="3"
                  offset-y="3"
                  color="success"
                  bordered
                >
                  
                   <VAvatar
                    :color="!userName ? 'primary' : undefined"
                    :variant="!userName ? 'tonal' : undefined"
                  >
                    <VImg v-if="userName" />
                    <VIcon v-else icon="tabler-user" />
                  </VAvatar> 
                </VBadge> -->
              </VListItemAction>
            </template>

            <VListItemTitle class="font-weight-medium">
              {{ userName ?? "Usuario" }}
            </VListItemTitle>
            <VListItemSubtitle></VListItemSubtitle>
          </VListItem>

          <PerfectScrollbar :options="{ wheelPropagation: false }">
            <template v-for="item in userProfileList" :key="item.title">
              <VListItem v-if="item.type === 'navItem'" :to="item.to" @click="item.onClick && item.onClick()">
                <template #prepend>
                  <VIcon class="me-2" :icon="item.icon" size="22" />
                </template>

                <VListItemTitle>{{ item.title }}</VListItemTitle>

                <template v-if="item.badgeProps" #append>
                  <VBadge v-bind="item.badgeProps" />
                </template>
              </VListItem>

              <VDivider v-else class="my-2" />
            </template>
          </PerfectScrollbar>
        </VList>
      </VMenu>
      <!-- !SECTION -->
    </VAvatar>
  </VBadge>
  <VDialog v-model="isSelectOficina" class="v-dialog-sm" persistent>
    <VCard title="Oficina">
      <VCardText>
        <VTable height="auto" class="text-no-wrap">
          <thead>
            <tr>
              <th class="text-uppercase">Oficinas</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="oficina in Oficinas" :key="oficina.id" @click="selectOficina(oficina.id)" class="cursor-pointer">
              <td>{{ oficina.nombre }}</td>
            </tr>
          </tbody>
        </VTable>
      </VCardText>
      <VCardText class="d-flex justify-end gap-3">
        <VBtn variant="tonal" color="secondary" @click="isSelectOficina = false">Cancelar</VBtn>
      </VCardText>
    </VCard>
  </VDialog>
  <VDialog v-model="isSelectPassword" class="v-dialog-sm" persistent>
    <VCard title="Ingrese su contraseña">
      <VForm ref="refVForm" @submit.prevent="onSubmit">
        <VCardText>
          <AppTextField v-model="Password" label="Contraseña" placeholder="············" :rules="[requiredValidator]"
            :type="isPasswordVisible ? 'text' : 'password'" :error-messages="errors.password"
            :append-inner-icon="isPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'"
            @click:append-inner="isPasswordVisible = !isPasswordVisible" />
        </VCardText>
        <VCardText>
          <div class="d-flex justify-end gap-3 mt-3">
            <VBtn variant="tonal" color="secondary" @click="isSelectPassword = false">Cancelar</VBtn>
            <VBtn class="ms-3" type="submit">
              Iniciar Sesión
            </VBtn>
          </div>
        </VCardText>

      </VForm>
    </VCard>
  </VDialog>
</template>
