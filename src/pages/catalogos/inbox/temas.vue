<script>
import { VDataTable } from "vuetify/labs/VDataTable";
import { useToast } from "vue-toastification";
import "vue-toastification/dist/index.css";
import categoria from '@/services/inbox/categoria-services.js';


  export default{
    name:"Tema",
    components:{
        VDataTable
    },
    data(){
        return{
            toast: useToast(),
            categorias:[],
            search:"",
            addCategoria:{
                id:0,
                nombre:""
            },
            categoriadatos:{
                id:0,
                nombre:""
            },
            refFormulario: "",
            open: false,
            modalEliminar: false,
            Editar: null,
            idEliminar: 0,
        }
    },
    methods:{

        async listaCategoria(){
            let res = await categoria.listaCategoria().then((res)=>{
                this.categorias = res.data;
            })
            console.log("estados",this.categorias);
        },

        OpenAgregar() {
            this.categoriadatos = { ...this.addCategoria };
            this.open = true;
        },

        CerrarModal() {
            this.categoriadatos = { ...this.categoriadatos };
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
            this.categoriadatos = { ...item };
            this.open = true;
        },

        async Guardar() {
            
            if (this.categoriadatos.id == 0) {
            
                let result = await categoria.addCategoria(this.categoriadatos);

                if (result.success) {
                    this.toast.success(result.message);
                    this.open = false;
                    await this.listaCategoria();
                } else {
                }
            } else {
                let result = await categoria.updateCategoria(this.categoriadatos);
                if (result.success) {
                    this.toast.success(result.message);
                    this.open = false;
                    await this.listaCategoria();
                } else {
                }
            }
        },

        async deleteEstados() {
            let result = await categoria.deleteCategoria(this.idEliminar);

            if (result.success) {
                this.toast.success(result.message);
                this.CerrarEliminar();
                await this.listaCategoria();
            } else {
            }
        },

        async onSubmit() {
            let form = await this.$refs.refFormulario.validate();
            if (form.valid) {
                this.Guardar();
            }
        },

        cumpleCriterioBusqueda(categoria) {
            if (!this.search) {
                return true;
            }
            const searchTerm = this.search.toLowerCase();
            const buscarTema = categoria.nombre.toLowerCase();
            return buscarTema.includes(searchTerm);
        },


    },

    async created(){
        await this.listaCategoria();
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
            />Temas
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
            <VCol cols="12" md="3" v-for="categoria in categorias">
                <VCard v-if="cumpleCriterioBusqueda(categoria)">
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
                                <div class="cente justify-end demo-space-x margen-botones">
                                    <VBtn
                                        title="Editar"
                                        size="25"
                                        color="success"
                                        @click="OpenEditar(categoria)"
                                    >
                                        <VIcon icon="tabler-edit" size="20" />
                                    </VBtn>
                                    <VBtn
                                        title="Eliminar"
                                        size="25"
                                        color="error"
                                        @click="OpenEliminar(categoria)"
                                    >
                                        <VIcon icon="tabler-trash" size="20" />
                                    </VBtn>
                                </div>
                            </VCol>
                        </VRow>
                        <hr />
                        <VRow class="mt-4">
                            <VCol md="2">
                                <VIcon color="primary" icon="tabler-category" class="me-5" />
                            </VCol>
                            <VCol md="10">
                                <p>{{ categoria.nombre }}</p>
                            </VCol>
                        </VRow>
                    </VCardItem>
                </VCard>
            </VCol>
        </VRow>
    </div>
    <VDialog v-model="open" max-width="500px">
        <VCard>
            <VCardTitle class="pa-6">
                <span class="headline">{{
                categoriadatos.id != 0
                    ? "Editar categoria"
                    : "Agregar categoria"
                }}</span>
            </VCardTitle>
            <VCardText class="pt-0 pb-3">
                <VForm
                    ref="refFormulario"
                    @submit.prevent="
                        () => {
                        onSubmit();
                        }">
                    <VRow>
                        <VCol cols="12" md="12">
                            <VTextField
                                v-model="categoriadatos.nombre"
                                label="Categoria"
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
            <VCardTitle class="d-flex justify-center mt-1 mb-1">¿Deseas eliminar el registro? </VCardTitle>
            <VCardActions>
                <VSpacer />
                <VBtn color="error" variant="outlined" @click="CerrarEliminar">
                    Cancelar
                </VBtn>

                <VBtn color="success" variant="elevated" @click="deleteEstados">
                    Aceptar
                </VBtn>
                <VSpacer />
            </VCardActions>
        </VCard>
    </VDialog>
    
</template>

<style>

.margen-botones button{
  margin: 16px 0 0 10px;
}

</style>


