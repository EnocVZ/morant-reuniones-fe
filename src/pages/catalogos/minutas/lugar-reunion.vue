<script>
import lugarReunionService from "@/services/lugar-reunion-service";
import { VDataTable } from "vuetify/labs/VDataTable";
import { useToast } from "vue-toastification";
import "vue-toastification/dist/index.css";
import Mapaview from "@/views/apps/email/MapaLugarReunion.vue";

export default {
    name: 'LugarReunion',
    components: {
        VDataTable,
        Mapaview
    },
    data() {
        return {
            toast: useToast(),
            search: "",
            page: 1,
            itemsPerPage: 8,
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
                    title: "Lugar",
                    key: "lugar",
                },
                {
                    title: "Direccion",
                    key: "direccion",
                },
                {
                    title: "Asientos",
                    key: "asientos",
                },
                {
                    title: "Acciones",
                    key: "actions",
                },
            ],

            lugarDefault: {
                id: 0,
                lugar: "",
                direccion: "",
                latitud: null,
                longitud: null,
                idTipoLugar: 3,
                asientos: 0,
            },
            lugarEdit: null,
            idLugarEliminar: 0,
            lugarGuardar: {
                id: 0,
                lugar: "",
                latitud: null,
                longitud: null,
                direccion: "",
                idTipoLugar: 0,
                asientos: 0,
            },
            lugares: [],
            tipoLugar: [],
            open: false,
            openEliminar: false,
            lugarErrores: {
                lugar: "",
                asientos: "",
                latitud: null,
                longitud: null,
            },
            refForm: null,
            totalConsultas: 0,
        }
    },

    methods: {
        async _ObtenerLugares() {
            let result = await lugarReunionService.ObtenerLugaresReunion()
                .then((res) => {
                    // console.log(res);
                    this.lugares = res;
                });
        },

        async obtenerTipoLugar() {
            let res = await lugarReunionService.ObtenerTipoLugares()
                .then((res) => {
                    this.tipoLugar = res.data;
                    console.log(this.tipoLugar)
                    console.log(this.lugarGuardar)
                })
        },

        async _ObtenerLugaresV2(page) {
            this.loading = true;

            if (this.hasMoreItems) {
                this.page = page ? page : this.page;

                let payload = {
                    buscar: "",
                    page: this.page,
                    take: this.itemsPerPage,
                };
                let result = await lugarReunionService.ObtenerLugaresReunionV2(payload)
                    .then((res) => {
                        this.lugares = this.page == 1 ? res.data : [...this.lugares, ...res.data];
                        console.log(this.lugares)
                        this.totalConsultas = res.total;
                        this.hasMoreItems = res.total > this.page * this.itemsPerPage;
                        this.loading = false;
                    }).catch((err) => {
                        console.log(err);
                        this.loading = false;
                    })
            }

        },

        OpenEliminar(item) {
            this.idLugarEliminar = item;
            this.openEliminar = true;
        },

        CerrarEliminar() {
            this.idLugarEliminar = 0;
            this.openEliminar = false;
        },

        OpenEditar(item) {
            console.log(item);
            this.lugarGuardar = { ...item };
            console.log(this.lugarGuardar);
            this.open = true;
            console.log(this.lugarGuardar.latitud)
            console.log(this.lugarGuardar.longitud)
        },

        OpenAgregar() {
            this.lugarGuardar = { ...this.lugarDefault };
            console.log(this.lugarGuardar);
            this.open = true;
        },

        CerrarModalAE() {
            this.lugarGuardar = { ...this.lugarDefault };
            this.open = false;
        },

        async Save() {
            let validacion = await this.$refs.refForm.validate();
            if (validacion.valid) {
                if (this.lugarGuardar.id == 0) {
                    let result = await lugarReunionService.AgregarLugarReunion(this.lugarGuardar);
                    console.log(result)
                    if (result.data.success) {
                        this.toast.success("Lugar Agregado");
                        this.open = false;
                        this.hasMoreItems = true
                        await this._ObtenerLugaresV2(1);
                        this.hasMoreItems = false
                        // await this._ObtenerLugares();
                    } else {
                        console.log(result);
                    }
                } else {
                    let result = await lugarReunionService.ActualizarLugarReunion(this.lugarGuardar);
                    if (result.data.success) {
                        this.toast.success("Lugar Actualizado");
                        this.open = false;
                        this.hasMoreItems = true
                        await this._ObtenerLugaresV2(1);
                        // await this._ObtenerLugares();
                        this.hasMoreItems = false
                    } else {
                        console.log(result);
                    }
                }
            } else {

            }

        },
        async masDatos() {
            this.page++;
            await this._ObtenerLugaresV2();
        },

        async scrolling({ target }) {
            const { scrollingElement } = target;
            const gap = 10;
            if (scrollingElement.scrollTop + scrollingElement.clientHeight + gap >= scrollingElement.scrollHeight) {
                $('#btn-mas').click();
            }
        },
        async buscarResultados() {
            if (this.search.trim() !== '' && this.loading == false) {
                let payload = {
                    buscar: this.search.trim(),
                    page: 1,
                    take: this.totalConsultas,
                };
                let result = await lugarReunionService.ObtenerLugaresReunionV2(payload);
                this.lugares = result.data;
                this.loading = false;
                this.hasMoreItems = false;

            } else {
                this.hasMoreItems = true;
                await this._ObtenerLugaresV2(1);
            }
        },
        async EliminarLugar() {
            let result = await lugarReunionService.EliminarLugarReunion(this.idLugarEliminar);
            if (result.data.success) {
                this.toast.success("Lugar Eliminado");
                this.openEliminar = false;
                this.hasMoreItems = true
                await this._ObtenerLugaresV2(1);
                this.hasMoreItems = false
                // await this._ObtenerLugares();
            } else {
                console.log(result);
            }
        },

    },

    async created() {
        await this._ObtenerLugaresV2();
        await this.obtenerTipoLugar();
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
}
</script>


<template>
    <div>
        <a href="" id="btn-mas" style="display: none;" @click.prevent="masDatos()"></a>
        <p class="text-2xl mb-6">
            <VIcon icon="tabler-map" color="primary" class="me-3" size="30" />
            Lista de Lugares De Reunión
        </p>
        <VRow>
            <VCol cols="12" md="4">
                <AppTextField v-model="search" density="compact" placeholder="Buscar..."
                    append-inner-icon="tabler-search" single-line hide-details dense outlined
                    @input="buscarResultados" />
            </VCol>
            <VCol cols="12" md="8">
                <VBtn color="cafe" @click="OpenAgregar" size="40" rounded="pill">
                    <VIcon class="tabler-plus" size="32" />
                </VBtn>
            </VCol>

            <!-- <VRow class="scroll_Tarjetas"> -->
            <VCol cols="12" md="3" v-for="lugar in lugares">
                <VCard>
                    <VCardItem>

                        <VRow class="py-2">
                            <VCol cols="6">
                                <VIcon class="tabler-map-pin-2" color="primary" />
                            </VCol>
                            <VCol cols="6" class="d-flex justify-end">
                                <VBtn title="Editar" size="25" color="success" @click="OpenEditar(lugar)">
                                    <VIcon icon="tabler-edit" size="20" />
                                </VBtn>
                                <VBtn class="ms-3" title="Eliminar" size="25" color="error"
                                    @click="OpenEliminar(lugar.id)">
                                    <VIcon icon="tabler-trash" size="20" />
                                </VBtn>
                            </VCol>
                        </VRow>

                        <VDivider />
                        <div>
                            <VRow class="margin_top">
                                <VCol md="2">
                                    <VIcon color="primary" class="tabler-map-pin" />
                                </VCol>
                                <VCol md="10">
                                    <p>{{ lugar.lugar }}</p>
                                </VCol>
                            </VRow>
                            <VDivider />
                            <VRow class="margin_top">
                                <VCol md="2" class="">
                                    <VIcon class="tabler-building-skyscraper" color="primary" />
                                </VCol>
                                <VCol md="10">
                                    <p>{{ lugar.direccion }}</p>
                                </VCol>
                            </VRow>
                            <VDivider />
                            <VRow class="margin_top">
                                <VCol md="2" class="sillaIcono_size">
                                    <img src="../../../../src/assets/images/logos/Recurso-2.ico" alt="" class="ms-1">
                                </VCol>
                                <VCol md="10">
                                    <p>{{ lugar.asientos }}</p>
                                </VCol>
                            </VRow>
                            <!-- <hr>
                            <VRow class="margin_top">
                                <VCol md="2" class="">
                                    <img src="" alt="">
                                </VCol>
                                <VCol md="10">
                                    <p>{{ lugar.nombreTipoLugar }}</p>
                                </VCol>
                            </VRow> -->
                        </div>
                        <VCol cols="12" md="12" class="map-align">
                            <Mapaview :lugarGuardar="lugar" />
                        </VCol>
                    </VCardItem>
                </VCard>
            </VCol>
            <!-- </VRow> -->
            <!-- <div class="tablaCentrar">
                <VCol cols="12" md="7">
                    <VCard>
                        <VCardItem>
                            <VDataTable :headers="headers" :items="lugares" :search="search">
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
    <VDialog v-model="open" max-width="600px">
        <VCard>
            <VCardTitle>
                <span class="headline">{{
            lugarGuardar.id != 0
                ? "Editar lugar"
                : "Agregar lugar"
        }}</span>
            </VCardTitle>
            <VCardText>
                <VContainer>
                    <VForm ref="refForm" @submit.prevent="Save()">
                        <VRow>
                            <VCol cols="12" md="12">
                                <AppTextField v-model="lugarGuardar.lugar" label="Lugar" validate-on="input"
                                    :rules="[requiredValidator]" />
                            </VCol>
                            <VCol v-if="lugarGuardar.id == 0" cols="12" md="12" class="map-align">
                                <Mapaview :lugarGuardar="lugarGuardar" />
                            </VCol>
                            <VCol cols="12" md="8">
                                <AppTextField v-model="lugarGuardar.direccion" label="Direccion" validate-on="input"
                                    :rules="[requiredValidator]" />
                            </VCol>
                            <VCol cols="12" md="4">
                                <AppTextField type="number" v-model="lugarGuardar.asientos" label="Asientos"
                                    validate-on="input" :rules="[requiredValidator]" />
                            </VCol>

                            <VCol cols="12" md="4">
                                <AppTextField v-model="lugarGuardar.latitud" label="Latitud" validate-on="input"
                                    :rules="[requiredValidator]" :disabled="true" />
                            </VCol>
                            <VCol cols="12" md="4">
                                <AppTextField v-model="lugarGuardar.longitud" label="Longitud" validate-on="input"
                                    :rules="[requiredValidator]" :disabled="true" />
                            </VCol>
                            <!-- <VCol cols="12" md="4" class="mt-6">
                                <VSelect :items="tipoLugar" item-title="nombre" item-value="id" v-model="lugarGuardar.idTipoLugar"
                                    label="Tipo lugar" :rules="[requiredValidator]"
                                />
                            </VCol> -->
                            <VCol cols="12">
                                <VCardActions>
                                    <VSpacer />
                                    <VBtn color="error" variant="outlined" @click="CerrarModalAE">
                                        Cerrar
                                    </VBtn>

                                    <VBtn color="success" type="submit"> Guardar </VBtn>
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
            <VCardTitle> ¿Deseas eliminar el registro? </VCardTitle>

            <VCardActions>
                <VSpacer />

                <VBtn color="error" variant="outlined" @click="CerrarEliminar">
                    Cancelar
                </VBtn>

                <VBtn color="success" variant="elevated" @click="this.EliminarLugar()">
                    Aceptar
                </VBtn>

                <VSpacer />
            </VCardActions>
        </VCard>
    </VDialog>
</template>




<style scoped>
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

.sillaIcono_size img {
    max-width: 15px;
}
</style>
