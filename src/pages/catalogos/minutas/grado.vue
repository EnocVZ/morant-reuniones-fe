<script>
import gradoService from "@/services/grado-service";
import { VDataTable } from "vuetify/labs/VDataTable";
import { useToast } from "vue-toastification";
import "vue-toastification/dist/index.css";

export default {
    name: "lista-grados",
    components: {
        VDataTable,
    },
    data() {
        return {
            toast: useToast(),
            search: "",
            page: 1,
            itemsPerPage: 12,
            hasMoreItems: true,
            loading: false,
            refForm: null,
            headers: [
                {
                    title: "",
                    key: "blank",
                },
                {
                    title: "Abreviatura",
                    key: "abreviatura",
                },
                {
                    title: "Nombre",
                    key: "nombre",
                },
                {
                    title: "Acciones",
                    key: "actions",
                },
            ],
            gradoDefault: {
                id: 0,
                abreviatura: '',
                nombre: '',
            },
            GradoEdit: null,
            idGradoEliminar: 0,
            gradoGuardar: {
                id: 0,
                abreviatura: '',
                nombre: '',
            },
            grados: [],
            open: false,
            openEliminar: false,
            gradoErrores: {
                nombre: "",
            },
            totalConsultas: 0,
        };
    },

    methods: {
        // async ObtenerGrado() {
        //     let result = await gradoService.obtenerGradoV1().then((res) => {
        //         // console.log(res);
        //         this.grados = res;
        //     });
        //     console.log(this.grados)
        // },
        async _ObtenerGrados(page) {
            this.loading = true;

            if (this.hasMoreItems) {
                this.page = page ? page : this.page;

                let payload = {
                    buscar: this.search,
                    page: this.page,
                    take: this.itemsPerPage,
                };

                let result = await gradoService.obtenerGrados(payload)
                    .then((res) => {
                        this.grados = this.page == 1 ? res.data : [...this.grados, ...res.data];
                        this.totalConsultas = res.total;
                        this.hasMoreItems = res.total > this.page * this.itemsPerPage;
                        this.loading = false;
                    }).catch((err) => {
                        console.log(err);
                        this.loading = false;
                    })
            }
        },
        async actualizarDatos() {
            await this._ObtenerGrados(); // O await this.ObtenerGrado();
        },
        async masDatos() {
            this.page++;
            await this._ObtenerGrados();
        },

        async scrolling({ target }) {
            const { scrollingElement } = target;
            const gap = 10;
            if (scrollingElement.scrollTop + scrollingElement.clientHeight + gap >= scrollingElement.scrollHeight) {
                $('#btn-mas').click();
            }
        },

        OpenEliminar(item) {
            console.log(item)
            this.idGradoEliminar = item;
            this.openEliminar = true;
        },

        CerrarEliminar() {
            this.idGradoEliminar = 0;
            this.openEliminar = false;
        },

        OpenEditar(item) {
            this.gradoGuardar = { ...item };
            this.open = true;
        },

        OpenAgregar() {
            this.gradoGuardar = { ...this.gradoDefault };
            this.open = true;
        },

        CerrarModalAE() {
            this.gradoGuardar = { ...this.gradoDefault };
            this.open = false;
        },

        async Guardar() {
            let validacion = await this.$refs.refForm.validate();
            if (validacion.valid) {
                if (this.gradoGuardar.id == 0) {
                    let result = await gradoService.AgregarGrado(this.gradoGuardar);

                    if (result.data.success) {
                        this.toast.success(result.data.message);
                        this.open = false;
                        this.hasMoreItems = true
                        //await this._ObtenerGrados(1);
                        await this.actualizarDatos(); 
                        this.hasMoreItems = false
                    } else {
                        console.log(result);
                    }
                } else {
                    let result = await gradoService.EditarGrado(this.gradoGuardar);

                    if (result.data.success) {
                        this.toast.success("Grado actualizado");
                        this.open = false;
                        this.hasMoreItems = true
                        //await this._ObtenerGrados(1);
                        await this.actualizarDatos(); 
                        this.hasMoreItems = false
                    } else {
                        console.log(result);
                    }
                }
            }
        },
        async buscarResultados() {
            if (this.search.trim() !== '' && this.loading == false) {
                let payload = {
                    buscar: this.search.trim(),
                    page: 1,
                    take: this.totalConsultas,
                };
                let result = await gradoService.obtenerGrados(payload);
                this.lugares = result.data;
                this.loading = false;
                this.hasMoreItems = false;

            } else {
                this.hasMoreItems = true;
                await this._ObtenerGrados(1);
            }
        },
        async EliminarGrado(idEliminar) {
            let result = await gradoService.EliminarElGrado(idEliminar);
            console.log('here --->', idEliminar)
            if (result.data.success) {
                this.toast.success("Grado eliminado");
                this.CerrarEliminar();
                this.hasMoreItems = true
               // await this._ObtenerGrados();
                await this.actualizarDatos(); 
                this.hasMoreItems = false
            } else {
                console.log(result);
            }
        },

        // Validar() {
        //     let valido = true;

        //     if (this.gradoGuardar.nombre.trim() == "")
        //         this.gradoErrores.nombre = "El nombre del grado es requerido";
        //     else this.gradoErrores.nombre = "";

        //     if (this.gradoErrores.nombre != "") valido = false;

        //     return valido;
        // },
    },

    async created() {
        await this._ObtenerGrados();
        // await this.ObtenerGrado()
    },

    mounted() {
        window.addEventListener('scroll', this.scrolling);
    },

    unmounted() {
        window.removeEventListener('scroll', this.scrolling);
    },

    beforeDestroy() {
        window.removeEventListener('scroll', this.scrolling);
    },
};
</script>

<template>
    <div>
        <a href="" id="btn-mas" style="display: none;" @click.prevent="masDatos()"></a>
        <p class="text-2xl mb-6">
            <VIcon icon="tabler-certificate" color="primary" class="me-3" size="30" />
            Lista de grados
        </p>
        <VRow>
            <VCol cols="12" md="4">
                <AppTextField v-model="search" density="compact" placeholder="Buscar..." append-inner-icon="tabler-search"
                    single-line hide-details dense outlined @change="buscarResultados" />
            </VCol>
            <VCol cols="12" md="8" class="mb-3">
                <VBtn color="cafe" @click="OpenAgregar" size="40" rounded="pill">
                    <VIcon class="tabler-plus" size="32" />
                </VBtn>
            </VCol>

            <VCol cols="12" md="3" v-for="grado in grados" :key="grado">
                <VCard>
                    <VCardItem>
                        <VRow>
                            <VCol md="12">
                                <div class="d-flex justify-end gap-1 margen-botones">
                                    <VBtn title="Editar" size="25" color="success" @click="OpenEditar(grado)">
                                        <VIcon icon="tabler-edit" size="20" />
                                    </VBtn>
                                    <VBtn title="Eliminar" size="25" color="error" @click="OpenEliminar(grado.id)">
                                        <VIcon icon="tabler-trash" size="20" />
                                    </VBtn>
                                </div>
                            </VCol>
                        </VRow>
                        <div class="margin_top">
                            <VRow >
                                <hr>
                                <VCol cols="2">
                                    <VIcon color="primary" class="tabler-certificate"  />
                                </VCol>
                                <VCol cols="10">
                                    <p>{{ grado.abreviatura }}</p>
                                </VCol>
                                <hr>
                                <VCol cols="2">
                                    <VIcon color="primary" class="tabler-file-certificate"  />
                                </VCol>
                                <VCol cols="10">
                                    <p>{{ grado.nombre }}</p>
                                </VCol>
                            </VRow>
                        </div>
                    </VCardItem>
                </VCard>
            </VCol>
        </VRow>
    </div>

    <VDialog v-model="open" max-width="600px">
        <VCard style="overflow: hidden;">
            <VCardTitle class="pa-6">
                <span class="headline">{{ gradoGuardar.id != 0 ? "Editar grado" : "Agregar grado" }}</span>
            </VCardTitle>
            <VCardText class="pt-0 pb-0">
                <VContainer class="pt-0 pb-0">
                    <VForm ref="refForm" @submit.prevent="Guardar()">
                        <VRow>
                            <VCol cols="12" md="3">
                                <AppTextField v-model="gradoGuardar.abreviatura" label="Abreviatura" validate-on="input"
                                    :rules="[requiredValidator]" />
                            </VCol>
                            <VCol cols="12" md="9">
                                <AppTextField v-model="gradoGuardar.nombre" label="Nombre" validate-on="input"
                                    :rules="[requiredValidator]" />
                            </VCol>

                            <VCol cols="12">
                                <VCardActions>
                                    <VSpacer />
                                    <VBtn color="error" variant="outlined" @click="CerrarModalAE">
                                        Cerrar
                                    </VBtn>

                                    <VBtn color="success" variant="elevated" type="submit"> Guardar </VBtn>
                                </VCardActions>
                            </VCol>
                        </VRow>
                    </VForm>
                </VContainer>
            </VCardText>
        </VCard>
    </VDialog>


    <VDialog v-model="openEliminar" max-width="500px">
        <VCard>
            <VCardTitle class="d-flex justify-center mt-1 mb-1">¿Deseas eliminar el registro?</VCardTitle>
            <VCardActions>
                <VSpacer />
                <VBtn color="error" variant="outlined" text @click="CerrarEliminar">Cancelar</VBtn>
                <VBtn color="success" variant="elevated" @click="EliminarGrado(idGradoEliminar)">Aceptar</VBtn>
                <VSpacer />
            </VCardActions>
        </VCard>
    </VDialog>
    <!-- <div class="tablaCentrar">
        <VCol cols="12" md="8">
            <VCard>
                <VCardItem>
                    <VDataTable :headers="headers" :items="grados" :search="search">

                        <template #item.actions="{ item }">
                            <div class="d-flex gap-1">
                                <VBtn title="Editar" size="25" color="success" @click="OpenEditar(item)">
                                    <VIcon icon="tabler-edit" size="20" />
                                </VBtn>
                                <VBtn title="Eliminar" size="25" color="error" @click="OpenEliminar(item.id)">
                                    <VIcon icon="tabler-trash" size="20" />
                                </VBtn>
                            </div>
                        </template>
                    </VDataTable>
                </VCardItem>
            </VCard>
        </VCol>
    </div> -->
</template>
  

<style lang="scss">
.tablaCentrar {
    width: 100%;
    display: flex;
    justify-content: center;
}


.cente {
    display: flex;
    justify-content: end;
    margin-bottom: 10px;
}

.margin_top {
    margin-top: 5px;
}

.margen-botones button{
  margin: 16px 0 0 10px;
}
hr {
    width: 100%;
    color: rgba(130, 129, 129, 0.292);
}
</style>