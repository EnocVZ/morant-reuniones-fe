<script>
import { VDataTable } from "vuetify/labs/VDataTable";
import { useToast } from "vue-toastification";
import "vue-toastification/dist/index.css";
import usuarioService from "@/services/usuarios-service";
import permisosService from "@/services/permisos-service";
import { emailValidator, lengthValidator } from "@/@core/utils/validators";
import oficinaServices from "@/services/oficina/oficina-services";
import { watchEffect } from "vue";
import { useCookie } from "@/@core/composable/useCookie";

export default {
    components: {
        VDataTable,
    },

    data() {
        return {
            toast: useToast(),
            idUsuarioEditar: 0,
            search: "",
            headers: [
                {
                    title: "Permiso",
                    key: "permiso",
                },
                {
                    title: "Seleccionar",
                    key: "seleccionar",
                },
            ],
            numberedSteps: [
                {
                    title: "Datos del usuario",
                    subtitle: "Ingrese los datos requeridos del usuario",
                },
                {
                    title: "Permisos del usuario",
                    subtitle: "Seleccione los permisos para el usuario",
                },
            ],
            isPasswordVisible: false,
            currentStep: 0,
            isCurrentStepValid: true,
            usuario: {
                id: 0,
                nombreCompleto: "",
                correo: "",
                password: "",
                tipoUsuario: null,
                tipoPermiso: null,
                nombreUsuario: "",
                permisos: [
                ],
                oficinas: [
                ],
            },
            idUsuarioEditar: 0,
            usuarioDefault: {
                id: 0,
                nombreCompleto: "",
                correo: "",
                password: "",
                tipoUsuario: 0,
                tipoPermiso: 0,
                nombreUsuario: "",
                permisos: [],
            },
            usuarioError: {
                id: "",
                nombreCompleto: "",
                correo: "",
                password: "",
                tipoUsuario: "",
                tipoPermiso: "",
                nombreUsuario: "",
                permisos: "",
            },
            tipoPermisoNormal: [
                {
                    title: "Inbox",
                    value: 1,
                },
                {
                    title: "Minutas",
                    value: 2,
                }
            ],
            tipoPermisoAdmin: [
                {
                    title: "Inbox",
                    value: 1,
                },
                {
                    title: "Minutas",
                    value: 2,
                },
                {
                    title: "Todos",
                    value: 3,
                },
            ],
            tipoUsuario: [
                {
                    title: "Usuario",
                    value: 1,
                },
                {
                    title: "Super",
                    value: 2,
                },
                {
                    title: "Super Administrador",
                    value: 3,
                },
            ],
            formUsuario: "",
            formPermisos: "",
            permisos: [],
            Oficinas: [],
            idOficina: null,
            unPermiso: false,
            selectAll: false,
            selectPermisos: [],
            editar: false,
            ListaTipoUsuarioBD: [],
        };
    },

    methods: {
        async _ObtenerPermisos() {
            try {
                this.permisos = await permisosService.obtenerPermisosPorProyecto(this.usuario.tipoPermiso);
                if (this.usuario.tipoUsuario == 3 && this.usuario.tipoPermiso == 2)
                    this.permisos = this.permisos.filter(x => x.id != 11);
                if(this.usuario.tipoUsuario == 3 && this.usuario.tipoPermiso == 1)
                    this.permisos = this.permisos.filter(x => x.id != 16);
            } catch (error) {
                console.log(error);
            }
        },

        async _ObtenerTipoUsuario() {
            try {
                console.log("Datos Id Oficina",)
                this.ListaTipoUsuarioBD = await usuarioService.obtenerTipoUsuarios()
                //if(useCookie('tipoUsuario').value == 1)
                if (useCookie('tipoUsuario').value == 2 && useCookie('idTipoPermiso').value == 2){
                    this.ListaTipoUsuarioBD = this.ListaTipoUsuarioBD.filter(x => x.id == 3)
                    this.tipoPermisoNormal = this.tipoPermisoNormal.filter(x => x.value === 2 )
                    console.log("1",this.tipoPermisoNormal)
                }
                    
                if (useCookie('tipoUsuario').value == 2 && useCookie('idTipoPermiso').value == 1){
                    this.ListaTipoUsuarioBD = this.ListaTipoUsuarioBD.filter(x => x.id == 3)
                    this.tipoPermisoNormal = this.tipoPermisoNormal.filter(x => x.value == 1 )
                    console.log("2",this.tipoPermisoNormal)
                }
                    
                if (useCookie('tipoUsuario').value == 1){
                    // this.ListaTipoUsuarioBD = this.ListaTipoUsuarioBD.filter(x => x.id != 1)
                     this.tipoPermisoNormal = this.tipoPermisoNormal.filter(x => x.value === 1 || x.value == 2 )
                }
                                 
            } catch (error) {
                console.log(error);
            }
        },
        async _ObtenerTipoUsuarioEditar() {
            try {
                console.log("Datos Id Oficina",)
                this.ListaTipoUsuarioBD = await usuarioService.obtenerTipoUsuarios()
                if (this.usuario.tipoUsuario == 1)
                    //this.ListaTipoUsuarioBD = this.ListaTipoUsuarioBD.filter(x => x.id == 1)
                if (this.usuario.tipoUsuario == 2)
                    this.ListaTipoUsuarioBD = this.ListaTipoUsuarioBD.filter(x => x.id == 2)
                    this.tipoPermisoNormal = this.tipoPermisoNormal.filter(x => x.value == 2 || x.value == 1)
                if (this.usuario.tipoUsuario == 3)
                    this.ListaTipoUsuarioBD = this.ListaTipoUsuarioBD.filter(x => x.id == 3)
                    this.tipoPermisoNormal = this.tipoPermisoNormal.filter(x => x.value == 1 || x.value == 2)

                // if (this.usuario  == 2)
                //     this.ListaTipoUsuarioBD = this.ListaTipoUsuarioBD.filter(x => x.id == 3)
            } catch (error) {
                console.log(error);
            }
        },
        async _UsuarioById() {
            try {
                let res = await usuarioService
                    .obtenerUsuarioPorId(this.idUsuarioEditar)
                    .then((data) => data);
                if (res?.status == 200) {
                    this.usuario = res?.data;
                }
            } catch (error) {
                console.log(error);
            }
        },

        async _ObtenerPermisosXIdUsuario() {
            try {
                let res = await usuarioService
                    .obtenerPermisosXIdUsuario(this.idUsuarioEditar)
                    .then((data) => data);
                res.data.map(data => {
                    this.selectPermisos.push(data.idPermiso)
                })
                this.usuario.permisos = res.data;
            } catch (error) {
                return error;
            }
        },

        async _ObtenerOficinasXIdUsuario() {
            try {
                let res = await usuarioService
                    .obtenerOficinasXIdUsuario(this.idUsuarioEditar)
                    .then((data) => data);
                this.usuario.oficinas = res.data;
                this.idOficina = res.data[0].idOficina;
            } catch (error) {
                return error;
            }
        },

        async _ObtenerOficinas() {
            try {
                let res = await oficinaServices.getOficinas().then((data) => data);
                this.Oficinas = res.data;
                // if (useCookie('tipoUsuario').value == 2)
                //     this.Oficinas = this.Oficinas.filter(x => x.id == useCookie('idOficina').value)
                // else
                    this.idOficina = useCookie('idOficina').value
            } catch (error) {
                console.log(error);
            }
        },

        onTipoUsuarioChange() {
            console.log("Datos");
            // console.log("Tipo de usuario: " + this.usuario.tipoUsuario);
            // console.log(this.usuario.tipoUsuario);
        },

        async _Guardar() {
            let res = await usuarioService
                .agregarUsuario(this.usuario)
                .then((data) => data);
            if (res?.data?.success) {
                this.toast.success(res?.data?.message);
                this.$router.go(-1);
            } else {
                this.toast.error(res?.response?.data?.message);
            }
        },
        async _Editar() {
            let res = await usuarioService
                .editarUsuario(this.usuario)
                .then((data) => data);
            if (res?.data?.success) {
                this.toast.success(res?.data?.message);
                this.$router.go(-1);
            } else {
                this.toast.error(res?.response?.data?.message);
            }
        },

        async FormUsuario() {
            let form = await this.$refs.formUsuario.validate();
            if (form.valid) {
                this.currentStep++;
                this.isCurrentStepValid = true;

            } else {
                this.isCurrentStepValid = false;
            }
        },

        async _Permisos(dato) {
            if (dato.id == 2) {
                this.selectAll = !this.selectAll
                if (this.selectAll == true) {
                    this.usuario.permisos = this.permisos.map(data => ({
                        idUsuario: 0,
                        idPermiso: data.id
                    }));
                    this.selectPermisos = this.permisos.map(data => data.id);
                } else {
                    this.selectPermisos = []
                    this.usuario.permisos = []
                }
            }

            if (dato.id != 2) {
                let existe = this.usuario.permisos.findIndex(data => data.idPermiso == 2)

                if (existe != -1) {
                    this.selectPermisos = this.selectPermisos.filter(item => item !== 2)
                    this.usuario.permisos.splice(existe, 1)
                }

                let index = this.usuario.permisos.findIndex(data => data.idPermiso == dato.id)

                if (index == -1) {
                    this.usuario.permisos.push({
                        idUsuario: 0,
                        idPermiso: dato.id
                    })
                    this.selectPermisos.push(dato.id)
                } else {
                    this.usuario.permisos.splice(index, 1)
                    let quitar = this.selectPermisos.indexOf(dato.id)
                    this.selectPermisos.splice(quitar, 1)
                }
                this.selectAll = false
            }
            console.log(this.usuario.permisos, "####", this.selectPermisos);
        },

        async _selectAll() {
            this.selectAll = !this.selectAll
            if (this.selectAll == true) {
                this.usuario.permisos.length = 0

                this.permisos.map(data => {
                    this.usuario.permisos.push({
                        idUsuario: 0,
                        idPermiso: data.id
                    })
                    // this.selectPermisos.push(data.id)
                })
            } else {
                // this.selectPermisos.length = 0
                this.usuario.permisos.length = 0
            }
        },

        async EnviarDatos() {
            // let form = this.$refs.formPermisos.validate()
            if (this.usuario.permisos.length != 0) {
                this.unPermiso = false
                if (this.usuario.id == 0) {
                    await this._Guardar()
                } else {
                    await this._Editar()
                }
            } else {
                this.unPermiso = true
            }
        }
    },

    async created() {
        // await this._ObtenerPermisos();
        await this._ObtenerTipoUsuario();
        await this._ObtenerOficinas();
        this.idUsuarioEditar =
            "id" in this.$route.params ? this.$route.params.id : 0;

        if (this.idUsuarioEditar != 0) {
            await this._UsuarioById();
            await this._ObtenerPermisosXIdUsuario();
            await this._ObtenerOficinasXIdUsuario();
            await this._ObtenerTipoUsuarioEditar();
        }

        watchEffect(async () => {
            this.usuario.oficinas = [
                {
                    idUsuario: 0,
                    idOficina: this.idOficina != null ? this.idOficina : 0,
                },
            ];
            // if (this.usuario.tipoUsuario == 3)
            // console.log("cuando el usuario es == 3 usuario")
            //     await this._ObtenerPermisos()

            if (this.usuario.tipoPermiso != null) {
                await this._ObtenerPermisos()
            }
            if (this.usuario.tipoPermiso == 1 && this.idUsuarioEditar == 0) {
                this.usuario.oficinas = []
                this.usuario.permisos = []
            } else {
                await this._ObtenerPermisosXIdUsuario();
            }

            console.log(this.usuario);
        });
    },
};
</script>
<template>
    <div>
        <VRow>
            <VCol cols="12" md="12">
                <RouterLink :to="{ name: 'usuario-usuarios' }">
                    <VBtn color="#b48d57">
                        <VIcon start icon="tabler-arrow-left" />
                    </VBtn>
                </RouterLink>
            </VCol>
            <VCol cols="12" md="12"></VCol>
        </VRow>
        <VCard>
            <VRow>
                <VCol cols="12" md="3" :class="$vuetify.display.smAndDown ? 'border-b' : 'border-e'">
                    <VCardText>
                        <!-- 👉 Stepper -->
                        <AppStepper v-model:current-step="currentStep" direction="vertical" :items="numberedSteps"
                            align="start" :is-active-step-valid="isCurrentStepValid" />
                    </VCardText>
                </VCol>
                <VCol cols="12" md="9">
                    <VCardText>
                        <VWindow v-model="currentStep" class="disable-tab-transition">
                            <VWindowItem>
                                <VForm ref="formUsuario" @submit.prevent="() => FormUsuario()">
                                    <VRow>
                                        <VCol cols="12">
                                            <h6 class="text-h6 font-weight-medium">
                                                Datos del usuario
                                            </h6>
                                            <p class="mb-0">
                                                Ingrese los datos requeridos del usuario
                                            </p>
                                        </VCol>
                                        <VCol cols="12" md="6">
                                            <VTextField v-model="usuario.nombreCompleto" label="Nombre completo"
                                                :rules="[(v) => !!v || 'Este campo es requerido']" required />
                                        </VCol>
                                        <VCol cols="12" md="6">
                                            <VTextField v-model="usuario.correo" placeholder="carterleonardo@gmail.com"
                                                :rules="[requiredValidator, emailValidator]" label="Email" />
                                            <!-- <VTextField v-model="usuario.correo" label="Correo"
                                                :rules="[(v) => !!v || 'Este campo es requerido', emailValidator]"
                                                required /> -->
                                        </VCol>
                                        <VCol cols="12" md="6">
                                            <VTextField v-model="usuario.nombreUsuario" label="Nombre de usuario"
                                                :rules="[(v) => !!v || 'Este campo es requerido']" required />
                                        </VCol>
                                        <VCol cols="12" md="6">
                                            <VTextField v-if="usuario.id == 0" v-model="usuario.password" label="Contraseña"
                                                placeholder="············" :rules="[
                                                    requiredValidator,
                                                    lengthValidator(usuario.password, 6),
                                                ]" :type="isPasswordVisible ? 'text' : 'password'"
                                                :append-inner-icon="isPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'"
                                                @click:append-inner="
                                                    isPasswordVisible = !isPasswordVisible
                                                    " />

                                            <VTextField v-else v-model="usuario.password" label="Contraseña"
                                                placeholder="············" :rules="[lengthValidator(usuario.password, 6)]"
                                                :type="isPasswordVisible ? 'text' : 'password'"
                                                :append-inner-icon="isPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'"
                                                @click:append-inner="
                                                    isPasswordVisible = !isPasswordVisible
                                                    " />
                                            <!-- <VTextField v-model="usuario.password" label="Contraseña"
                                                :rules="[(v) => !!v || 'Este campo es requerido', lengthValidator(usuario.password, 6),passwordValidator]"
                                                required /> -->
                                        </VCol>
                                        <VCol cols="12" md="6">
                                            <VSelect v-model="usuario.tipoUsuario" :items="ListaTipoUsuarioBD"
                                                item-title="nombre" item-value="id" v-on:input="onTipoUsuarioChange"
                                                label="Tipo de usuario" :rules="[(v) => !!v || 'Este campo es requerido']"
                                                required />
                                        </VCol>
                                        <VCol cols="12" md="6"
                                            v-if="this.usuario.tipoUsuario == 2 || this.usuario.tipoUsuario == 3">
                                            <VSelect v-model="usuario.tipoPermiso" :items="tipoPermisoNormal"
                                                @change="onTipoUsuarioChange" label="Tipo de permiso"
                                                :rules="[(v) => !!v || 'Este campo es requerido']" required />
                                        </VCol>
                                        <VCol cols="12" md="6" v-if="this.usuario.tipoUsuario == 1">
                                            <VSelect v-model="usuario.tipoPermiso" :items="tipoPermisoNormal"
                                                v-on:input="onTipoUsuarioChange" label="Tipo de permiso"
                                                :rules="[(v) => !!v || 'Este campo es requerido']" required />
                                        </VCol>

                                        <VCol v-if="this.usuario.tipoPermiso == 2 && this.usuario.tipoUsuario != 1"
                                            cols="12" md="6">
                                            <VSelect placeholder="Selecione una oficina " label="Oficinas"
                                                v-model="idOficina" :items="Oficinas" item-title="nombre" item-value="id"
                                                :rules="[(v) => !!v || 'Este campo es requerido']" />
                                        </VCol>
                                    </VRow>
                                    <VCol cols="12">
                                        <div class="d-flex flex-wrap gap-4 justify-sm-space-between justify-center mt-8">
                                            <VBtn color="secondary" variant="tonal" disabled>
                                                <VIcon icon="tabler-arrow-left" start class="flip-in-rtl" />
                                                Atras
                                            </VBtn>

                                            <VBtn type="submit">
                                                Siguiente
                                                <VIcon icon="tabler-arrow-right" end class="flip-in-rtl" />
                                            </VBtn>
                                        </div>
                                    </VCol>
                                </VForm>
                            </VWindowItem>
                            <VWindowItem>
                                <VForm ref="formPermisos" @submit.prevent="EnviarDatos">
                                    <VRow>
                                        <VCol cols="10">
                                            <h6 class="text-h6 font-weight-medium">
                                                Permisos del usuario
                                            </h6>
                                            <p class="mb-0">
                                                Seleccione los permisos para el usuario
                                            </p>
                                        </VCol>
                                        <!-- <VCol cols="2" class="text-end">
                                            <VCheckbox title="Seleccionar todos" label="" true-icon="tabler-check"
                                                false-icon="tabler-x" color="cafe" @click="_selectAll" />
                                        </VCol> -->
                                        <VCol cols="12">
                                            <VRow>
                                                <VCol cols="12" md="6" lg="4" v-for="permiso2 in permisos" item-key="id"
                                                    :loading="loading">
                                                    <VCard>
                                                        <VCardText>
                                                            <div class="d-flex">
                                                                <VCheckbox v-model="selectPermisos" true-icon="tabler-check"
                                                                    false-icon="tabler-x" :value="permiso2.id"
                                                                    @click="_Permisos(permiso2)" color="cafe" />
                                                                <p class="mb-0 mt-1">{{ permiso2.permiso }}</p>
                                                            </div>
                                                        </VCardText>
                                                    </VCard>
                                                </VCol>
                                            </VRow>
                                            <VAlert color="error" variant="tonal" class="text-center"
                                                icon="tabler-alert-triangle"
                                                v-if="unPermiso == true && usuario.permisos.length == 0">Seleccione al
                                                menos un
                                                permiso
                                            </VAlert>

                                            <!-- <VDataTable
                        v-model="usuario.permisos"
                        :headers="headers"
                        :items="permisos"
                        item-key="id"
                        show-select
                        :search="search"
                        :loading="loading"
                        :rows-per-page-items="[5, 10, 15]"
                        :footer-props="{
                          'items-per-page-options': {
                            label: 'Registros por página',
                            items: [5, 10, 15],
                          },
                        }"
                      ></VDataTable> -->
                                        </VCol>
                                    </VRow>
                                    <VCol cols="12">
                                        <div class="d-flex flex-wrap gap-4 justify-sm-space-between justify-center mt-8">
                                            <VBtn color="secondary" variant="tonal" @click="currentStep--">
                                                <VIcon icon="tabler-arrow-left" start class="flip-in-rtl" />
                                                Previous
                                            </VBtn>

                                            <VBtn type="submit">
                                                Guardar
                                                <VIcon icon="tabler-arrow-right" end class="flip-in-rtl" />
                                            </VBtn>
                                        </div>
                                    </VCol>
                                </VForm>
                            </VWindowItem>
                        </VWindow>
                    </VCardText>
                </VCol>
            </VRow>
        </VCard>
    </div>
</template>
