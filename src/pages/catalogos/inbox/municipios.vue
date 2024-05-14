<script>
import { VDataTable } from "vuetify/labs/VDataTable";
import { useToast } from "vue-toastification";
import "vue-toastification/dist/index.css";
import Municipios from '@/services/inbox/municipios-services.js';

export default{
    name:"Municipios",
    components:{
        VDataTable
    },
    data(){
        return{
            toast: useToast(),
            municipios:[],
            search: "",
            headers: [
                // { nombre: 'Id', presidente, partido },
                // { title: 'ID', key: 'id' },
                { title: 'Nombre', key: 'nombre' },
                { title: 'Presidente', key: 'presidente' },
                { title: 'Partido', key: 'partido' },
                { title: "Acciones", key: "actions" },
            ],
            addmunicipios:{
                id:0,
                nombre:"",
                presidente:"",
                partido:""

            },
            municipiosdatos:{
                id:0,
                nombre:"",
                presidente:"",
                partido:""
            },
            refFormulario: "",
            open: false,
            modalEliminar: false,
            Editar: null,
            idEliminar: 0,
        }
    },

    methods:{

        async listaMunicipios(){
            let res = await Municipios.Municipios().then((res)=>{
                this.municipios = res.data;
            })
        },

        OpenAgregar() {
            this.municipiosdatos = { ...this.addmunicipios };
            this.open = true;
        },

        CerrarModal() {
            this.municipiosdatos = { ...this.municipiosdatos };
            this.open = false;
        },

        OpenEliminar(item) {
            this.idEliminar = item.id;
            this.modalEliminar = true;
        },

        CerrarEliminar() {
            this.idEliminar = 0;
            this.modalEliminar = false;
        },

        OpenEditar(item) {
            this.municipiosdatos = { ...item };
            this.open = true;
        },

        async Guardar() {
            
            if (this.municipiosdatos.id == 0) {

                let result = await Municipios.addMunicipio(this.municipiosdatos);

                if (result.data.success) {
                    this.toast.success(result.data.message);
                    this.open = false;
                    await this.listaMunicipios();
                } else {
                }
            } else {
                let result = await Municipios.updateMunicipio(this.municipiosdatos);
                if (result.data.success) {
                    this.toast.success(result.data.message);
                    this.open = false;
                    await this.listaMunicipios();
                } else {
                }
            }
        },

        async deleteMunicipio() {
            let result = await Municipios.deleteMunicipio(this.idEliminar);

            if (result.data.success) {
                this.toast.success(result.data.message);
                this.CerrarEliminar();
                await this.listaMunicipios();
            } else {
            }
        },

        async onSubmit() {
            let form = await this.$refs.refFormulario.validate();
            if (form.valid) {
                this.Guardar();
            }
        },

        cumpleCriterioBusqueda(municipio) {
            if (!this.search) {
                return true;
            }
            const searchTerm = this.search.toLowerCase();
            const buscarMunicipio = municipio.nombre.toLowerCase();
            const buscarPresidente = municipio.presidente.toLowerCase();
            const buscarPartido = municipio.partido.toLowerCase();
            return (
                buscarMunicipio.includes(searchTerm) ||
                buscarPresidente.includes(searchTerm) ||
                buscarPartido.includes(searchTerm)
            );
        },


    },

    async created(){
        await this.listaMunicipios();
    }

}

</script>

<template>
    <div>
        <p class="text-2xl">
            <VIcon 
                icon="tabler-category"
                color="primary"
                class="me-3"
                size="30"
            />Municipios
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
                />
            </VCol>
            <VCol cols="12" md="6">
                <VBtn color="cafe" @click="OpenAgregar" size="40" rounded="pill">
                <VIcon class="tabler-plus" size="32" />
                </VBtn>
            </VCol>

            <!-- 
            <VCol cols="12" md="3" v-for="municipio in municipios">
                <VCard v-if="cumpleCriterioBusqueda(municipio)">
                    <VCardItem>
                        <VRow class="pt-0 pb-2">
                            <VCol md="2">
                                <VIcon
                                icon="tabler-timeline-event-text"
                                color="primary"
                                class=""
                                />
                            </VCol>
                            <VCol md="10">
                                <div class="cente demo-space-x">
                                    <VBtn
                                        title="Editar"
                                        size="25"
                                        color="success"
                                        @click="OpenEditar(municipio)"
                                    >
                                        <VIcon icon="tabler-edit" size="20" />
                                    </VBtn>
                                    <VBtn
                                        title="Eliminar"
                                        size="25"
                                        color="error"
                                        @click="OpenEliminar(municipio)"
                                    >
                                        <VIcon icon="tabler-trash" size="20" />
                                    </VBtn>
                                </div>
                            </VCol>
                        </VRow>
                        <hr />
                        <VRow class="mt-4">
                            <VCol md="12" style="padding-bottom: 0;">
                                <p style="margin-bottom: 0;font-weight: bold;">Municipio</p>
                            </VCol>
                            <VCol md="12">
                                <p>{{ municipio.nombre }}</p>
                            </VCol>
                            <VCol md="12" style="padding-bottom: 0;">
                                <p style="margin-bottom: 0;font-weight: bold;">Presidente</p>
                            </VCol>
                            <VCol md="12">
                                <p>{{ municipio.presidente }}</p>
                            </VCol>
                            <VCol md="12" style="padding-bottom: 0;">
                                <p style="margin-bottom: 0;font-weight: bold;">Partido</p>
                            </VCol>
                            <VCol md="12">
                                <p>{{ municipio.partido }}</p>
                            </VCol>
                        </VRow>
                    </VCardItem>
                </VCard>
            </VCol>  -->

            <!-- TABLA -->
            <VCol class="pt-0 pb-0" cols="12" md="12">
                <VCard>
                    <VCardItem>
                        <VDataTable :headers="headers" :items="municipios" :search="search">
                            <template #item.actions="{ item }">
                                <div class="d-flex gap-2">
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
            <!-- fin TABLA -->

        </VRow>
    </div>
    <VDialog v-model="open" max-width="500px">
        <VCard style="overflow: hidden;">
            <VCardTitle class="pa-6">
                <span class="headline">{{
                municipiosdatos.id != 0
                    ? "Editar Municipio"
                    : "Agregar Municipio"
                }}</span>
            </VCardTitle>
            <VCardText class="pt-0 pb-0">
                <VForm
                    ref="refFormulario"
                    @submit.prevent="
                        () => {
                        onSubmit();
                        }">
                    <VRow>
                        <VCol cols="12" md="12">
                            <VTextField
                                v-model="municipiosdatos.nombre"
                                label="Municipio"
                                validate-on="input"
                                :rules="[
                                requiredValidator,
                                ]"
                            />
                        </VCol>
                        <VCol cols="12" md="12">
                            <VTextField
                                v-model="municipiosdatos.presidente"
                                label="Presidente"
                                validate-on="input"
                                :rules="[
                                requiredValidator,
                                ]"
                            />
                        </VCol>
                        <VCol cols="12" md="12">
                            <VTextField
                                v-model="municipiosdatos.partido"
                                label="Partido"
                                validate-on="input"
                                :rules="[
                                requiredValidator,
                                ]"
                            />
                        </VCol>
                        <VCol cols="12">
                            <VCardActions>
                                <VSpacer />
                                <VBtn color="error" variant="outlined" @click="CerrarModal">
                                Cerrar
                                </VBtn>

                                <VBtn color="success" variant="elevated" type="submit"> Guardar </VBtn>
                            </VCardActions>
                        </VCol>
                    </VRow>
                </VForm>
            </VCardText>
        </VCard>
    </VDialog>
    <VDialog v-model="modalEliminar" max-width="500px">
        <VCard>
            <VCardTitle class="d-flex justify-center mt-1 mb-1"> ¿Deseas eliminar el registro? </VCardTitle>
            <VCardActions>
                <VSpacer />
                <VBtn color="error" variant="outlined" @click="CerrarEliminar">
                    Cancelar
                </VBtn>

                <VBtn color="success" variant="elevated" @click="deleteMunicipio">
                    Aceptar
                </VBtn>
                <VSpacer />
            </VCardActions>
        </VCard>
    </VDialog>
    
</template>