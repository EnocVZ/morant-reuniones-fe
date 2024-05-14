<script>
import { VDataTable } from "vuetify/labs/VDataTable";
import { useToast } from "vue-toastification";
import "vue-toastification/dist/index.css";
import estadosAcont from '@/services/inbox/status-acontecimientos-services.js';


  export default{
    name:"Estado Acontecimiento",
    components:{
        VDataTable
    },
    data(){
        return{
            toast: useToast(),
            estadosAcontecimiento:[],
            addStatusAcon:{
                id:0,
                nombre:""
            },
            estatusAcon:{
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

        async listaEstadosAcon(){
            let res = await estadosAcont.listaEstadosAcon().then((res)=>{
                this.estadosAcontecimiento = res.data;
            })
            console.log("estados",this.estadosAcontecimiento);
        },

        OpenAgregar() {
            this.estatusAcon = { ...this.addStatusAcon };
            this.open = true;
        },

        CerrarModal() {
            this.estatusAcon = { ...this.estatusAcon };
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
            this.estatusAcon = { ...item };
            this.open = true;
        },

        async Guardar() {
            
            if (this.estatusAcon.id == 0) {
                console.log(this.estatusAcon, "entro add");
                let result = await estadosAcont.addEstadoAcon(this.estatusAcon);

                if (result.success) {
                    this.toast.success(result.message);
                    this.open = false;
                    await this.listaEstadosAcon();
                } else {
                }
            } else {
                let result = await estadosAcont.updateEstadoAcon(this.estatusAcon);
                if (result.success) {
                    this.toast.success(result.message);
                    this.open = false;
                    await this.listaEstadosAcon();
                } else {
                }
            }
        },

        async deleteEstados() {
            let result = await estadosAcont.deleteEstadoAcon(this.idEliminar);

            if (result.success) {
                this.toast.success(result.message);
                this.CerrarEliminar();
                await this.listaEstadosAcon();
            } else {
            }
        },

        async onSubmit() {
            let form = await this.$refs.refFormulario.validate();
            if (form.valid) {
                this.Guardar();
            }
        },


    },

    async created(){
        await this.listaEstadosAcon();
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
            />Estados de acontecimientos
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
            <VCol cols="12" md="3" v-for="estadosAcont in estadosAcontecimiento">
                <VCard>
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
                                        @click="OpenEditar(estadosAcont)"
                                    >
                                        <VIcon icon="tabler-edit" size="20" />
                                    </VBtn>
                                    <VBtn
                                        title="Eliminar"
                                        size="25"
                                        color="error"
                                        @click="OpenEliminar(estadosAcont)"
                                    >
                                        <VIcon icon="tabler-trash" size="20" />
                                    </VBtn>
                                </div>
                            </VCol>
                        </VRow>
                        <hr />
                        <VRow class="mt-4">
                            <VCol md="2">
                                <VIcon color="primary" icon="tabler-alert-triangle" class="me-5" />
                            </VCol>
                            <VCol md="10">
                                <p>{{ estadosAcont.nombre }}</p>
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
                estatusAcon.id != 0
                    ? "Editar estado acontecimiento"
                    : "Agregar estado acontecimiento"
                }}</span>
            </VCardTitle>
            <VCardText class="pt-0">
                <VForm
                    ref="refFormulario"
                    @submit.prevent="
                        () => {
                        onSubmit();
                        }">
                    <VRow>
                        <VCol cols="12" md="12">
                            <VTextField
                                v-model="estatusAcon.nombre"
                                label="Estado"
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

@/services/inbox/status-acontecimientos-services.js