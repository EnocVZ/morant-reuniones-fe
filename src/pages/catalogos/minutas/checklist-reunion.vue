<script>
import { VDataTable } from 'vuetify/labs/VDataTable'
import { useToast } from 'vue-toastification'
import 'vue-toastification/dist/index.css'
import { requiredValidator } from '@/@core/utils/validators'
import checklistService from '@/services/checklist-service'

export default {
    name: 'ChecklistReunion',
    components: {
        VDataTable
    },
    data() {
        return {
            search: ' ',
            toast: useToast(),
            page: 1,
            itemsPerPage: 12,
            hasMoreItems: true,
            loading: false,
            headers: [
                { text: 'Emoji', value: 'emoji' },
                { text: 'Actividad', value: 'actividad' },
                { text: 'Acciones', value: 'actions', sortable: false }
            ],
            IdCheckListEliminar: 0,
            ChecklistDefault: {
                id: 0,
                actividad: '',
                emoji: ''
            },
            ChecklistEditar: null,
            ChecklistGuardar: {
                id: 0,
                actividad: '',
                emoji: ''
            },
            checklist: [],
            open: false,
            openEliminar: false,
            refFrom: null,
            totalConsultas: 0,
        }
    },
    methods: {
        async obtenerCheckList() {
            try {
                let result = await checklistService.obtenerCheckList();
                this.checklist = result.data;
            } catch (error) {
                console.log(error);
            }
        },
        async obtenerCheckListV2(page) {
            this.loading = true;

            if (this.hasMoreItems) {
                this.page = page ? page : this.page;

                let payload = {
                    buscar: "",
                    page: this.page,
                    take: this.itemsPerPage,
                };
                let result = await checklistService.obtenerCheckListV2(payload)
                    .then((res) => {
                        this.checklist = this.page == 1 ? res.data : [...this.checklist, ...res.data];
                        this.totalConsultas = res.total;
                        this.hasMoreItems = res.total > this.page * this.itemsPerPage;
                        this.loading = false;
                    }).catch((err) => {
                        console.log(err);
                        this.loading = false;
                    });
            }
        },
        async Save() {
            try {

                let validation = await this.$refs.refForm.validate();
                console.log('estoy aqui')
                console.log(validation);
                console.log(this.ChecklistGuardar.emoji)
                console.log(this.ChecklistGuardar.actividad);
                if (validation && this.ChecklistGuardar.emoji != '' && this.ChecklistGuardar.actividad != '') {

                    if (this.ChecklistGuardar.id == 0) {
                        let result = await checklistService.agregarCheckList(this.ChecklistGuardar);
                        if (result.data.success) {
                            this.hasMoreItems=true;
                            await this.obtenerCheckListV2(1);
                            this.hasMoreItems=false;
                            this.open = false;
                            this.toast.success('Se guardo correctamente');
                        } else {
                            this.$toast.error('Ocurrio un error al guardar');
                            // console.log(result);
                        }
                    } else {
                        let result = await checklistService.actualizarCheckList(this.ChecklistGuardar);
                        if (result.data.success) {
                            this.toast.success("Se actualizo correctamente");
                            this.open = false;
                            // await this.obtenerCheckList()
                            this.hasMoreItems=true;
                            await this.obtenerCheckListV2(1);
                            this.hasMoreItems=false;
                        } else {
                            console.log(result);
                        }
                    }
                } else {
                    this.$toast.error('Favor de llenar todos los campos');
                }
            } catch (error) {
                console.log('--->', error);
            }
        },
        async masDatos() {
            this.page++;
            await this.obtenerCheckListV2();
        },

        async scrolling({ target }) {
            const { scrollingElement } = target;
            const gap = 10;
            if (scrollingElement.scrollTop + scrollingElement.clientHeight + gap >= scrollingElement.scrollHeight) {
                $('#btn-mas').click();
            }
        },

        async EliminarChecklist() {
            let result = await checklistService.eliminarCheckList(this.IdCheckListEliminar);
            if (result.data.success) {
                this.toast.success("Se elimino correctamente");
                this.openEliminar = false;
                this.hasMoreItems=true;
                await this.obtenerCheckListV2(1);
                this.hasMoreItems=false;
                // await this.obtenerCheckList()
            } else {
                console.log(result);
            }
        },
        async buscarResultados() {
            if (this.search.trim() !== '' && this.loading == false) {
                let payload = {
                    buscar: this.search.trim(),
                    page: 1,
                    take: this.totalConsultas,
                };
                let result = await checklistService.obtenerCheckListV2(payload);
                this.checklist = result.data;
                this.loading = false;
                this.hasMoreItems = false;
            } else {
                this.hasMoreItems = true;
                await this.obtenerCheckListV2(1);
            }
        },

        OpenAgregar() {
            this.ChecklistGuardar = { ...this.ChecklistDefault };
            this.open = true;
        },
        OpenEditar(Id) {
            this.ChecklistGuardar = { ...Id };
            this.open = true;
        },
        OpenEliminar(item) {
            this.IdCheckListEliminar = item;
            this.openEliminar = true;
        },
        CerrarEliminar() {
            this.IdCheckListEliminar = 0;
            this.openEliminar = false;
        },
        cerrar() {
            this.ChecklistGuardar = { ...this.ChecklistDefault };
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
        await this.obtenerCheckListV2();
        await this.obtenerCheckListV2();
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
            <VIcon icon="tabler-users-group" color="primary" class="me-3" size="30" />
            CheckList Reunión
        </p>
        <VRow>
            <VCol cols="12" md="4">
                <AppTextField v-model="search" density="compact" placeholder="Buscar..." append-inner-icon="tabler-search"
                    single-line hide-details dense outlined @input="buscarResultados" />
            </VCol>
            <VCol cols="12" md="8">
                <VBtn color="cafe" @click="OpenAgregar" size="40" rounded="pill">
                    <VIcon class="tabler-plus" size="32" />
                </VBtn>
            </VCol>
            <!-- <VRow class="scroll_Tarjetas"> -->
            <VCol cols="12" md="3" v-for="check in checklist">
                <VCard>
                    <VCardItem>
                        <VRow>
                            <VCol md="12">
                                <div class="cente justify-end demo-space-x margen-botones">
                                    <VBtn title="Editar" size="25" color="success" @click="OpenEditar(check)">
                                        <VIcon icon="tabler-edit" size="20" />
                                    </VBtn>
                                    <VBtn title="Eliminar" size="25" color="error" @click="OpenEliminar(check.id)">
                                        <VIcon icon="tabler-trash" size="20" />
                                    </VBtn>
                                </div>
                            </VCol>
                        </VRow>
                        <hr>
                        <div>
                            <VRow class="margin_top">
                                <VCol md="2">
                                    <VIcon color="primary" class="tabler-check" />
                                </VCol>
                                <VCol md="10">
                                    <p>{{ check.emoji }} {{ check.actividad }}</p>
                                </VCol>
                            </VRow>
                        </div>
                    </VCardItem>
                </VCard>
            </VCol>
            <!-- </VRow> -->

            <!-- <div class="tablaCentrar">
                <VCol cols="12" md="7">
                    <VCard>
                        <VCardItem>
                            <VDataTable :headers="headers" :items="checklist" :search="search">
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
            <VCardTitle class="pa-6 pb-0">
                <span class="headline">{{
                    ChecklistGuardar.id == 0
                    ? "Agregar Actividad"
                    : "Editar Actividad"
                }}</span>
            </VCardTitle>
            <VCardText class="pt-0 pb-0">
                <VContainer>
                    <VForm ref="refForm" @submit.prevent="Save()">
                        <VRow>
                            <VCol cols="12" md="4">
                                <AppTextField v-model="ChecklistGuardar.emoji" label="Emoji" validate-on="input"
                                    :rules="[requiredValidator]" />
                            </VCol>
                            <VCol cols="12" md="8">
                                <AppTextField v-model="ChecklistGuardar.actividad" label="Actividad" validate-on="input"
                                    :rules="[requiredValidator]" />
                            </VCol>
                            <VCol class="pa-0" cols="12" md="12">
                                <VCardActions>
                                    <VSpacer />
                                    <VBtn color="error" variant="outlined" @click="cerrar">
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
            <VCardTitle class="d-flex justify-center mt-1 mb-1"> ¿Deseas eliminar el registro? </VCardTitle>

            <VCardActions>
                <VSpacer />

                <VBtn color="error" variant="outlined" @click="CerrarEliminar">
                    Cancelar
                </VBtn>

                <VBtn color="success" variant="elevated" @click="this.EliminarChecklist()">
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

/* .scroll_Tarjetas {
    height: 490px;
    max-height: 50%;
    width: 100%;
    display: flex;
} */

.margen-botones button{
  margin: 16px 0 0 10px;
}
</style>

