<script>
import { VDataTable } from "vuetify/labs/VDataTable";
import { useToast } from "vue-toastification";
import "vue-toastification/dist/index.css";
import Oficina from '@/services/oficina/oficina-services.js';

export default{
    name:"Oficina",
    components:{
        VDataTable
    },
    data(){
        return{
            toast: useToast(),
            oficinas:[],
            search: "",
            headers: [
                // { nombre: 'Id', presidente, partido },
                // { title: 'ID', key: 'id' },
                { title: 'Nombre', key: 'nombre' },
                { title: "Acciones", key: "actions" },
            ],
            addoficina:{
                id:0,
                nombre:"",

            },
            oficinadatos:{
                id:0,
                nombre:"",
            },
            refFormulario: "",
            open: false,
            modalEliminar: false,
            Editar: null,
            idEliminar: 0,
            modalAdvertencia : false
        }
    },

    methods:{

        async listaOficinas(){
            let res = await Oficina.getOficinas().then((res)=>{
                this.oficinas = res.data;
            })
        },

        OpenAgregar() {
            this.oficinadatos = { ...this.addoficina };
            this.open = true;
        },

        CerrarModal() {
            this.oficinadatos = { ...this.oficinadatos };
            this.open = false;
        },

        OpenEliminar(item) {
            console.log("item alelimiar",item)
            this.modalAdvertencia = true;
            this.idEliminar = item;
            // this.modalEliminar = true;
        },
       
        AceptarAdvertencia(){
            this.modalAdvertencia = false;
            this.modalEliminar = true
        },

        CerrarAdvertencia(){
            this.idEliminar = 0;
            this.modalAdvertencia = false;
        },
        CerrarEliminar() {
            this.idEliminar = 0;
            this.modalEliminar = false;
        },

        OpenEditar(item) {
            console.log("item al editar0",item)
            this.oficinadatos = { ...item };
            this.open = true;
        },

        async Guardar() {
            
            if (this.oficinadatos.id == 0) {

                let result = await Oficina.addOficina(this.oficinadatos);

                if (result.data.success) {
                    this.toast.success(result.data.message);
                    this.open = false;
                    await this.listaOficinas();
                } else {
                }
            } else {
                let result = await Oficina.updateOficina(this.oficinadatos);
                if (result.data.success) {
                    this.toast.success(result.data.message);
                    this.open = false;
                    await this.listaOficinas();
                } else {
                }
            }
        },

        async deleteOficina() {
            console.log("id eliminar",this.idEliminar);
            let result = await Oficina.deleteOficina(this.idEliminar);

            if (result.data.success) {
                this.toast.success(result.data.message);
                this.CerrarEliminar();
                await this.listaOficinas();
            } else {
            }
        },

        async onSubmit() {
            let form = await this.$refs.refFormulario.validate();
            if (form.valid) {
                this.Guardar();
            }
        },

        cumpleCriterioBusqueda(oficina) {
            if (!this.search) {
                return true;
            }
            const searchTerm = this.search.toLowerCase();
            const buscarOficina = oficina.nombre.toLowerCase();
           
            return buscarOficina.includes(searchTerm)
        },

    },

    async created(){
        await this.listaOficinas();
    }

}

</script>

<template>
    <div>
        <p class="text-2xl">
            <VIcon 
                icon="tabler-building"
                color="primary"
                class="me-3"
                size="30"
            />Oficinas
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
            <VCol cols="12" md="12">
                <VCard>
                    <VCardItem>
                        <VDataTable :headers="headers" :items="oficinas" :search="search">
                            <template #item.actions="{item }">
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
                oficinadatos.id != 0
                    ? "Editar Oficina"
                    : "Agregar Oficina"
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
                                v-model="oficinadatos.nombre"
                                label="Oficina"
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

                <VBtn color="success" variant="elevated" @click="deleteOficina">
                    Aceptar
                </VBtn>
                <VSpacer />
            </VCardActions>
        </VCard>
    </VDialog>
    <VDialog v-model="modalAdvertencia" max-width="950px">
        <VCard class="elevation-12"> <!-- Agrega una clase de elevación para dar profundidad al card -->
            <VCardTitle class="d-flex justify-center mt-1 mb-4"> <!-- Aumenta el espacio en la parte inferior -->
                Si elimina esta oficina, los usuarios ya no tendrán acceso al sistema. Asigne a los usuarios a otra oficina.
            </VCardTitle>
            <VCardActions class="d-flex justify-center"> <!-- Centra los botones horizontalmente -->
                <VBtn class="mr-4" color="error" text @click="CerrarAdvertencia"> <!-- Usa color "error" y estilo "text" para el botón Cancelar -->
                    Cancelar
                </VBtn>

                <VBtn color="success" outlined @click="AceptarAdvertencia"> <!-- Usa color "success" y estilo "outlined" para el botón Aceptar -->
                    Aceptar
                </VBtn>
            </VCardActions>
        </VCard>
    </VDialog>
    
</template>