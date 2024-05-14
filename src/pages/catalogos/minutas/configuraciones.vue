<script>
import configuracionService from "@/services/configuracion-service"
import { VDataTable } from 'vuetify/labs/VDataTable'
import { useToast } from 'vue-toastification'
import 'vue-toastification/dist/index.css'
import { requiredValidator } from '@/@core/utils/validators'

export default {
    name: 'Configuracion',
    components: {
        VDataTable
    },
    data() {
        return {
            search: '',
            toast: useToast(),
            page: 1,
            itemsPerPage: 8,
            hasMoreItems: true,
            loading: false,
            headers: [
                // { title: "Id", key: "id" },
                { title: "Titulo", key: "titulo" },
                { title: "Instancia WhatsApp", key: 'instanciaW' },
                { title: "Token WhatsApp", key: "tokenW" },
                { title: "Acciones", key: "actions" }
            ],
            IdConfiguracionEliminar: 0,
            ConfiguracionDefault: {
                id: 0,
                titulo: '',
                instanciaW: '',
                tokenW: ''
            },
            ConfiguracionGuardar: {
                id: 0,
                titulo: '',
                instanciaW: '',
                tokenW: ''
            },
            refFrom: '',
            Configuraciones: [],
            open: false,
            openEliminar: false,
            totalConsultas: 0,

        }

    },
    methods: {
        async obtenerConfiguraciones() {
            try {
                let result = await configuracionService.listarConfiguracion();
                this.Configuraciones = result.data
            } catch (error) {
                console.log(error)
            }

        },
        async obtenerConfiguracionesV2(page) {
            this.loading = true;

            if (this.hasMoreItems) {
                this.page = page ? page : this.page;

                let payload = {
                    buscar: "",
                    page: this.page,
                    take: this.itemsPerPage,
                };
                let result = await configuracionService.listarConfiguracionV2(payload)
                    .then((res) => {
                        this.Configuraciones = this.page == 1 ? res.data : [...this.Configuraciones, ...res.data];
                        this.totalConsultas = res.total;
                        this.hasMoreItems = res.total > this.page * this.itemsPerPage;
                        this.loading = false;
                    }).catch((err) => {
                        console.log(err);
                        this.loading = false;
                    })
            }
        },

        validarCampoVacio() {
            let valido = true;

            if (this.ConfiguracionGuardar.titulo.trim() === '' ||
                this.ConfiguracionGuardar.instanciaW.trim() === '' ||
                this.ConfiguracionGuardar.tokenW.trim() === ''
            ) {
                valido = false;
            }

            return valido;
        },
        async guardarConfiguracion() {
            if (this.validarCampoVacio()) {
                if (this.ConfiguracionGuardar.id == 0) {
                    console.log(this.ConfiguracionGuardar);
                    let result = await configuracionService.agregarConfiguracion(this.ConfiguracionGuardar);

                    if (result.data.success) {
                        this.toast.success("Configuracion guardada");
                        this.open = false;
                        await this.obtenerConfiguracionesV2(1);
                    } else {
                        console.log(result);
                    }
                } else {
                    let result = await configuracionService.actualizarConfiguracion(
                        this.ConfiguracionGuardar
                    );

                    if (result.data.success) {
                        this.toast.success("Configuracion Actualizada");
                        this.open = false;
                        await this.obtenerConfiguracionesV2(1);
                    } else {
                        console.log(result);
                    }
                }
            }


        },
        async masDatos() {
            this.page++;
            await this.obtenerConfiguracionesV2();
        },

        async scrolling({ target }) {
            const { scrollingElement } = target;
            const gap = 10;
            if (scrollingElement.scrollTop + scrollingElement.clientHeight + gap >= scrollingElement.scrollHeight) {
                $('#btn-mas').click();
            }
        },
        /* async EliminarConfiguracion() {
             let result = await configuracionService.eliminarConfiguracion(this.IdConfiguracionEliminar);
             if (result.data.success) {
                 this.toast.success("Configuracion Eliminada")
                 this.cerrarEliminar();
                 await this.obtenerConfiguracionesV2(1);
             } else {
                 this.toast.success("Error")
                 console.log(result);
             }
         },*/
        openAgregar() {
            this.ConfiguracionGuardar = { ...this.ConfiguracionDefault }
            // console.log(this.ConfiguracionGuardar)
            this.open = true
        },
        OpenEditar(Id) {
            this.ConfiguracionGuardar = { ...Id };
            this.open = true
        },
        async buscarResultados() {
            if (this.search.trim() !== '' && this.loading == false) {
                let payload = {
                    buscar: this.search.trim(),
                    page: 1,
                    take: this.totalConsultas,
                };
                let result = await configuracionService.listarConfiguracionV2(payload);
                this.Configuraciones = result.data;
                this.loading = false;
                this.hasMoreItems = false;

            } else {
                this.hasMoreItems = true;
                await this.obtenerConfiguracionesV2(1);
            }
        },
        /*OpenEliminar(id) {
            this.IdConfiguracionEliminar = id,
                this.openEliminar = true
        },*/
        cerrarEliminar() {
            this.IdConfiguracionEliminar = 0
            this.openEliminar = false
        },

        cerrar() {
            this.ConfiguracionGuardar = { ...this.ConfiguracionDefault }
            this.open = false;

        },
        async onSubmit() {
            let res = await this.$refs.refFrom.validate();
            if (res.valid) {
                console.log(res);
            }
        },
    },
    async created() {
        // await this.obtenerConfiguraciones();
        await this.obtenerConfiguracionesV2();
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

<!-- ORIGINAL CON TABLAS -->

<!--<template>
    <div>
        <p class="text-2xl mc-6">
            <VIcon icon="tabler-users-group" color="primary"  class="me-3" size="30"/>
            Configuraciones
        </p>
        <VRow class="VRow_class">
            <VCol cols="12" md="4">
                <AppTextField v-model="search" density="compact" placeholder="Buscar..." append-inner-icon="tabler-search"
                    single-line hide-details dense outlined />
            </VCol>
            
            <VCol cols="12" md="12">
                <VCard>
                    <VCardItem>
                        <VDataTable :headers="headers" :items="Configuraciones" :search="search">
                            <template #item.actions="{ item }">
                                <div class="d-flex gap-1">
                                    <IconBtn @click="OpenEditar(item)">
                                        <VIcon icon="tabler-edit" />
                                    </IconBtn>
                                </div>
                            </template>
                        </VDataTable>
                    </VCardItem>
                </VCard>
            </VCol>
        </VRow>
    </div>
    
    <VDialog v-model="open" max-width="550px">
        <VCard>
            <VCardTitle>
                <span class="headline">{{ ConfiguracionGuardar.id !== 0 ? 'Editar Configuracion' :
                    'Agregar Configuracion' }}</span>
            </VCardTitle>
            
            <VCardText> 
                <VContainer>
                    <VForm ref="refFrom" @submit.prevent="onSubmit()">
                        <VRow>
                            <VCol cols="12" md="12">
                                <VTextField v-model="ConfiguracionGuardar.titulo" label="Titulo"
                                    :rules="[requiredValidator => !!requiredValidator || 'Titulo es Requerido']" />
                            </VCol>
                            <VCol cols="12" class="d-flex gap-4">
                                <VBtn color="success" variant="elevated" @click="guardarConfiguracion()" type="submit">
                                    Guardar
                                </VBtn>
                                <VBtn color="secondary" type="reset" variant="tonal" @click="cerrar">
                                    Cancelar
                                </VBtn>
                            </VCol>
                        </VRow>
                    </VForm>
                </VContainer>
            </VCardText>
        </VCard>
    </VDialog>
</template>-->
<template>
    <div>
        <a href="" id="btn-mas" style="display: none;" @click.prevent="masDatos()"></a>
        <p class="text-2xl mc-6">
            <VIcon icon="tabler-settings" color="primary" class="me-3" size="30" />
            Configuraciones
        </p>
        <VRow class="VRow_class">
            <VCol cols="12" md="4">
                <AppTextField v-model="search" density="compact" placeholder="Buscar..."
                    append-inner-icon="tabler-search" single-line hide-details dense outlined
                    @input="buscarResultados" />
            </VCol>
            <!-- Boton amarillo -->
            <VCol cols="12" md="8">
                <!-- <VBtn color="cafe" @click="openAgregar" size="40" rounded="pill">
                    <VIcon class="tabler-plus" size="32" />
                </VBtn> -->
            </VCol>
            <!-- ventana emergente boton amarillo -->
            <!--
             <VDialog v-model="open" max-width="500px">
                <VCard>
                    <VCardTitle>
                        <span class="headline">{{
                            grupoDatos.id != 0 ? "Editar grupo" : "Agregar grupo"
                        }}</span>
                    </VCardTitle>
                    <VCardText>
                        <VForm ref="refFormulario" @submit.prevent="() => {
                                onSubmit();
                            }
                            ">
                            <VRow>
                                <VCol cols="12" md="12">
                                    <VTextField v-model="grupoDatos.ultramsgID" label="IdUltramsg" validate-on="input"
                                        :rules="[requiredValidator]" />
                                </VCol>

                                <VCol cols="12">
                                    <VCardActions>
                                        <VSpacer />
                                        <VBtn color="error" variant="outlined" @click="CerrarModal">
                                            Cerrar
                                        </VBtn>

                                        <VBtn color="success" type="submit"> Guardar </VBtn>
                                    </VCardActions>
                                </VCol>
                            </VRow>
                        </VForm>
                    </VCardText>
                    <VCardActions>
                        <VSpacer />
                    </VCardActions>
                </VCard>
            </VDialog>
           -->

            <VCol cols="12" md="3" v-for="configuracion in Configuraciones">
                <VCard>
                    <VCardItem>
                        <VRow>
                            <VCol md="12">
                                <div class="cente justify-end demo-space-x margen-botones">
                                    <VBtn title="Editar" size="25" color="success" @click="OpenEditar(configuracion)">
                                        <VIcon icon="tabler-edit" size="20" />
                                    </VBtn>
                                </div>
                            </VCol>
                        </VRow>
                        <hr>
                        <div>
                            <VRow class="margin_top">
                                <VCol md="2">
                                    <VIcon color="primary" class="tabler-file-settings" />
                                </VCol>
                                <VCol md="10">
                                    <p>{{ configuracion.titulo }}</p>
                                    <p>{{ configuracion.instanciaW }}</p>
                                    <p>{{ configuracion.tokenW }}</p>
                                </VCol>
                            </VRow>
                        </div>
                    </VCardItem>
                </VCard>
            </VCol>

            <!-- TABLA titulo y acciones
            <div class="tabla_centrar">
                <VCol cols="12" md="6">
                    <VCard>
                        <VCardItem class="tablaCentrarElementos">
                            <VDataTable :headers="headers" :items="Configuraciones" :search="search">
                                <template #item.actions="{ item }">
                                    <div class="d-flex gap-1">
                                        <VBtn title="Editar" size="25" color="success" @click="OpenEditar(item)">
                                            <VIcon icon="tabler-edit" size="20" />
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

    <!-- Ventana flotante boton -->
    <VDialog v-model="open" max-width="550px">
        <VCard>
            <VCardTitle class="pa-6">
                <span class="headline">{{ ConfiguracionGuardar.id !== 0 ? 'Editar Configuracion' :
            'Agregar Configuracion' }}</span>
            </VCardTitle>
            <VCardText class="pt-0 pb-0">
                <VContainer>
                    <VForm ref="refFrom" @submit.prevent="onSubmit()">
                        <VRow>

                            <VCardSubtitle class="mb-3">Datos de PDF</VCardSubtitle>

                            <VCol cols="12" md="12">
                                <VTextField v-model="ConfiguracionGuardar.titulo" label="Título"
                                    :rules="[requiredValidator => !!requiredValidator || 'Título es Requerido']" />
                            </VCol>


                            <!-- Grupo de Datos de WhatsApp -->

                            <VCardSubtitle class="my-3">Datos de WhatsApp</VCardSubtitle>
                            <VCol cols="12" md="12">
                                <VTextField v-model="ConfiguracionGuardar.instanciaW" label="Instancia"
                                    :rules="[requiredValidator => !!requiredValidator || 'Instancia es Requerido']" />
                            </VCol>
                            <VCol cols="12" md="12">
                                <VTextField v-model="ConfiguracionGuardar.tokenW" label="Token"
                                    :rules="[requiredValidator => !!requiredValidator || 'Token es Requerido']" />
                            </VCol>



                            <VCol cols="12" class="d-flex justify-end gap-4">
                                <VBtn color="error" type="reset" variant="outlined" @click="cerrar">
                                    Cancelar
                                </VBtn>
                                <VBtn color="success" variant="elevated" @click="guardarConfiguracion()" type="submit">
                                    Guardar
                                </VBtn>
                            </VCol>
                        </VRow>
                    </VForm>
                </VContainer>
            </VCardText>
        </VCard>
    </VDialog>
</template>



<!-- con tarjetas -->
<!--
<template>
    <div>
        <p class="text-2xl mc-6">
            <VIcon icon="tabler-users-group" color="primary"  class="me-3" size="30"/>
            Configuraciones
        </p>
        <VRow class="VRow_class">
            <VCol cols="12" md="4">
                <AppTextField v-model="search" density="compact" placeholder="Buscar..." append-inner-icon="tabler-search"
                    single-line hide-details dense outlined />
            </VCol>
            
            <VCol cols="12" md="12">
                <VCard>
                    <VCardItem>
                        <VDataTable :headers="headers" :items="Configuraciones" :search="search">
                            <template #item.actions="{ item }">
                                <div class="d-flex gap-1">
                                    <IconBtn @click="OpenEditar(item)">
                                        <VIcon icon="tabler-edit" />
                                    </IconBtn>
                                </div>
                            </template>
                        </VDataTable>
                    </VCardItem>
                </VCard>
                <VCol cols="12" md="3">
                    <vCard>
                        <VCardItem>
                            <VRow>
                                <VCol md="6">
                                    <div class="cente demo-space-x">
                                        <div :headers="headers" :items="Configuraciones" :search="search">
                                            <template #item.actions="{ item }">
                                                <VBtn title="Editar" size="25" color="success" @click="OpenEditar(item)">
                                                <VIcon
                                                    icon="tabler-edit" 
                                                    size="20"
                                                />
                                                </VBtn>
                                            </template>
                                        </div>
                                        <VBtn title="Eliminar" size="25" color="error" @click="OpenEliminar(grupo)">
                                        <VIcon
                                            icon="tabler-trash" 
                                            size="20"
                                        />
                                        </VBtn>
                                    </div>
                                </VCol>
                            </VRow>
                            <br>
                            <VRow class="pt-0 pb-2">
                                <VCol md="6">
                                    IdUltramsg
                                </VCol>
                            </VRow>
                        </VCardItem>
                        <VDataTable :headers="headers" :items="Configuraciones" :search="search">
                                <template #item.actions="{ item }">
                                    <div class="d-flex gap-1">
                                        <IconBtn @click="OpenEditar(item)">
                                            <VIcon icon="tabler-edit" />
                                        </IconBtn>
                                    </div>
                                </template>
                            </VDataTable>
                    </vCard>
                </VCol>
            </VCol>
        </VRow>
    </div>
    
    <VDialog v-model="open" max-width="550px">
        <VCard>
            <VCardTitle>
                <span class="headline">{{ ConfiguracionGuardar.id !== 0 ? 'Editar Configuracion' :
                    'Agregar Configuracion' }}</span>
            </VCardTitle>
            
            <VCardText> 
                <VContainer>
                    <VForm ref="refFrom" @submit.prevent="onSubmit()">
                        <VRow>
                            <VCol cols="12" md="12">
                                <VTextField v-model="ConfiguracionGuardar.titulo" label="Titulo"
                                    :rules="[requiredValidator => !!requiredValidator || 'Titulo es Requerido']" />
                            </VCol>
                            <VCol cols="12" class="d-flex gap-4">
                                <VBtn color="success" variant="elevated" @click="guardarConfiguracion()" type="submit">
                                    Guardar
                                </VBtn>
                                <VBtn color="secondary" type="reset" variant="tonal" @click="cerrar">
                                    Cancelar
                                </VBtn>
                            </VCol>
                        </VRow>
                    </VForm>
                </VContainer>
            </VCardText>
        </VCard>
    </VDialog>    
</template> -->




<style lang="scss">
.tabla_centrar {
    width: 100%;
    display: flex;
    justify-content: center;
    // background-color: red;
}

.tablaCentrarElementos {
    width: 100%;
    display: flex;
    justify-content: end;
}

.cente {
    display: flex;
    justify-content: end;
    margin-bottom: 10px;
}

.margin_top {
    margin-top: 5px;
}

.margen-botones button {
    margin: 16px 0 0 10px;
}
</style>
