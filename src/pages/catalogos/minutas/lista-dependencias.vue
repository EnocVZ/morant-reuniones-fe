<script>
import dependenciaService from "@/services/dependencia-service";
import { VDataTable } from "vuetify/labs/VDataTable";
import { useToast } from "vue-toastification";
import "vue-toastification/dist/index.css";

export default {
    name: "lista-dependencias",
    components: {
        VDataTable,
    },
    data() {
        return {
            toast: useToast(),
            search: "",
            page: 1,
            itemsPerPage: 18,
            hasMoreItems: true,
            loading: false,
            headers: [
                {
                    title: "",
                    key: "blank",
                },
                // {
                //     title: "Id",
                //     key: "id",
                // },
                {
                    title: "Dependencia",
                    key: "nombre",
                },
                {
                    title: "Acciones",
                    key: "actions",
                },
            ],
            dependenciaDefault: {
                id: 0,
                nombre: "",
            },
            dependenciaEdit: null,
            idDependenciaEliminar: 0,
            dependenciaGuardar: {
                id: 0,
                nombre: "",
            },
            Dependencias: [],
            open: false,
            openEliminar: false,
            dependenciaErrores: {
                nombre: "",
            },
            totalConsultas : 0,
        };
    },

    methods: {
        async _ObtenerDependencias() {
            let result = await dependenciaService
                .obtenerDependencias()
                .then((res) => {
                    this.Dependencias = res.data;
                });
        },

        async _ObtenerDependenciasV2(page) {
            this.loading = true;

            if (this.hasMoreItems) {
                this.page = page ? page : this.page;

                let payload = {
                    buscar: "",
                    page: this.page,
                    take: this.itemsPerPage,
                };
                let result = await dependenciaService.obtenerDependenciasV2(payload)
                    .then((res) => {
                        this.Dependencias = this.page == 1 ? res.data : [...this.Dependencias, ...res.data];
                        this.totalConsultas = res.total;
                        this.hasMoreItems = res.total > this.page * this.itemsPerPage;
                        this.loading = false;
                    }).catch((err) => {
                        console.log(err);
                        this.loading = false;
                    })
            }
        },

        async masDatos() {
            this.page++;
            await this._ObtenerDependenciasV2();
        },

        async scrolling({ target }) {
            const { scrollingElement } = target;
            const gap = 10;
            if (scrollingElement.scrollTop + scrollingElement.clientHeight + gap >= scrollingElement.scrollHeight) {
                // await this.masDatos();
                $('#btn-mas').click();
            }
        },

        OpenEliminar(item) {
            this.idDependenciaEliminar = item;
            this.openEliminar = true;
        },

        CerrarEliminar() {
            this.idDependenciaEliminar = 0;
            this.openEliminar = false;
        },

        OpenEditar(item) {
            console.log(item);
            this.dependenciaGuardar = { ...item };
            console.log(this.dependenciaGuardar);
            this.open = true;
        },

        OpenAgregar() {
            this.dependenciaGuardar = { ...this.dependenciaDefault };
            console.log(this.dependenciaGuardar);
            this.open = true;
        },

        CerrarModalAE() {
            this.dependenciaGuardar = { ...this.dependenciaDefault };
            this.open = false;
        },
        async buscarResultados() {
            if(this.search.trim() !== '' && this.loading == false){
                let payload = {
                    buscar: this.search.trim(),
                    page: 1,
                    take: this.totalConsultas,
                };
                let result = await dependenciaService.obtenerDependenciasV2(payload);
                this.Dependencias = result.data;
                this.loading = false;
                this.hasMoreItems = false;

            }else{
                this.hasMoreItems = true;
                await this._ObtenerDependenciasV2(1);
            }
        },
        async Guardar() {
            if (this.Validar()) {
                if (this.dependenciaGuardar.id == 0) {
                    // console.log(this.dependenciaGuardar);

                    let result = await dependenciaService.agregarDependencia(
                        this.dependenciaGuardar
                    );

                    if (result.data.success) {
                        this.toast.success(result.data.message);
                        this.open = false;
                        await this._ObtenerDependenciasV2(1);
                    } else {
                        console.log(result);
                    }
                } else {
                    let result = await dependenciaService.actualizarDependencia(
                        this.dependenciaGuardar
                    );

                    if (result.data.success) {
                        this.toast.success("Dependencia actualizada");
                        this.open = false;
                        await this._ObtenerDependenciasV2(1);
                    } else {
                        console.log(result);
                    }
                }
            }
        },

        async EliminarDependencia() {
            let result = await dependenciaService.eliminarDependencia(
                this.idDependenciaEliminar
            );

            if (result.data.success) {
                this.toast.success("Dependencia eliminada");
                this.CerrarEliminar();
                await this._ObtenerDependenciasV2();
            } else {
                console.log(result);
            }
        },

        Validar() {
            let valido = true;

            if (this.dependenciaGuardar.nombre.trim() == "")
                this.dependenciaErrores.nombre =
                    "El nombre de la dependencia es requerido";
            else this.dependenciaErrores.nombre = "";

            if (this.dependenciaErrores.nombre != "") valido = false;

            return valido;
        },
    },

    async created() {
        await this._ObtenerDependenciasV2();
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
            <VIcon icon="tabler-building" color="primary" class="me-3" size="30" />
            Lista de dependencias
        </p>
        <VRow>
            <VCol cols="12" md="4">
                <AppTextField
                v-model="search"
                density="compact"
                placeholder="Buscar..."
                append-inner-icon="tabler-search"
                single-line
                hide-details
                dense
                outlined
                @input="buscarResultados"
                />
            </VCol>
            <VCol cols="12" md="8" class="mb-3">
                <VBtn color="cafe" @click="OpenAgregar" size="40" rounded="pill">
                    <VIcon class="tabler-plus" size="32" />
                </VBtn>
            </VCol>

            <VCol cols="12" md="3" v-for="dependencia in Dependencias">
                <VCard>
                    <VCardItem>
                        <VRow>
                            <VCol md="12">
                                <div class="cente justify-end demo-space-x margen-botones">
                                    <VBtn title="Editar" size="25" color="success" @click="OpenEditar(dependencia)">
                                        <VIcon icon="tabler-edit" size="20" />
                                    </VBtn>
                                    <VBtn title="Eliminar" size="25" color="error"
                                        @click="OpenEliminar(dependencia.id)">
                                        <VIcon icon="tabler-trash" size="20" />
                                    </VBtn>
                                </div>
                            </VCol>
                        </VRow>
                        <hr>
                        <div>
                            <VRow class="margin_top">
                                <VCol md="2">
                                    <VIcon color="primary" class="tabler-building" />
                                </VCol>
                                <VCol md="10">
                                    <p>{{ dependencia.nombre }}</p>
                                </VCol>
                            </VRow>
                        </div>
                    </VCardItem>
                </VCard>
            </VCol>


            <!-- <div class="tablaCentrar">
                <VCol cols="12" md="8">
                    <VCard>
                        <VCardItem>
                            <VDataTable :headers="headers" :items="Dependencias" :search="search">
                                
                                <template #item.actions="{ item }">
                                    <div class="d-flex gap-1">
                                        <VBtn title="Editar" size="25" color="success" @click="OpenEditar(item)">
                                        <VIcon 
                                        icon="tabler-edit" 
                                        size="20"
                                        />
                                        </VBtn>
                                        <VBtn title="Eliminar" size="25" color="error" @click="OpenEliminar(item.id)">
                                        <VIcon 
                                        icon="tabler-trash"
                                        size="20"
                                        />
                                        </VBtn>
                                    </div>
                                </template>
                            </VDataTable>
                        </VCardItem>
                    </VCard>
                </VCol>
            </div> -->
        </VRow>
    </div>

    <VDialog v-model="open" max-width="500px">
        <VCard>
            <VCardTitle class="pa-6">
                <span class="headline">{{
                    dependenciaGuardar.id != 0
                    ? "Editar dependencia"
                    : "Agregar dependencia"
                }}</span>
            </VCardTitle>
            <VCardText class="pt-0 pb-0">
                <!-- {{ dependenciaGuardar.nombre }} -->
                <VContainer class="pa-0">
                    <VCol cols="12" md="12">
                        <VTextField v-model="dependenciaGuardar.nombre" label="Dependencia" validate-on="input" />
                        <span style="color: red" v-if="dependenciaErrores.nombre != ''"></span>
                    </VCol>
                </VContainer>
            </VCardText>
            <VCardActions>
                <VSpacer />

                <VBtn color="error" variant="outlined" @click="CerrarModalAE">
                    Cerrar
                </VBtn>

                <VBtn color="success" variant="elevated" @click="Guardar()">
                    Guardar
                </VBtn>
            </VCardActions>
        </VCard>
    </VDialog>

    <VDialog v-model="openEliminar" max-width="500px">
        <VCard>
            <VCardTitle class="d-flex justify-center mt-1 mb-1"> ¿Deseas eliminar el registro? </VCardTitle>

            <VCardActions>
                <VSpacer />

                <VBtn color="error" variant="outlined" @click="CerrarEliminar">
                    Cancelar
                </VBtn>

                <VBtn color="success" variant="elevated" @click="this.EliminarDependencia()">
                    Aceptar
                </VBtn>

                <VSpacer />
            </VCardActions>
        </VCard>
    </VDialog>
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
</style>