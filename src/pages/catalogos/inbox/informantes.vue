<script>
import informantesServices from "@/services/inbox/informantes-services";
import { VDataTable } from "vuetify/labs/VDataTable";
import { useToast } from "vue-toastification";
import "vue-toastification/dist/index.css";

export default {
  name: "Grupos",
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
      headers: [
        // {
        //   title: "",
        //   key: "blank",
        // },
        // {
        //   title: "Id",
        //   key: "id",
        // },
        {
          title: "Nombre",
          key: "nombreCompleto",
        },
        {
          title: "Telefono",
          key: "numeroTelefono",
        },
        {
          title: "Area",
          key: "area",
        },
        {
          title: "Acciones",
          key: "actions",
        },
      ],
      refFormulario: "",
      datosInformantes: {
        id: 0,
        nombreCompleto: "",
        numeroTelefono: "",
        area          : ""
      },
      Editar: null,
      idEliminar: 0,
      informanteDatos: {
        id: 0,
        nombreCompleto: "",
        numeroTelefono: "",
        area          : ""
      },
      Informantes: [],
      open: false,
      modalEliminar: false,
      totalConsultas : 0,
    };
  },

  methods: {
    async listaInformante() {
      let result = await informantesServices.listaInformantes().then((res) => {
        this.Informantes = res.data;
      });
    },

    async listaInformanteV2(page) {
      this.loading = true;

      if (this.hasMoreItems) {
          this.page = page ? page : this.page;

          let payload = {
              buscar: "",
              page: this.page,
              take: this.itemsPerPage,
          };
          let result = await informantesServices.listaInformantesV2(payload)
              .then((res) => {
                  this.Informantes = this.page == 1 ? res.data : [...this.Informantes, ...res.data];
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
      this.idEliminar = item.id;
      this.modalEliminar = true;
    },

    CerrarEliminar() {
      this.idEliminar = 0;
      this.modalEliminar = false;
    },

    OpenEditar(item) {
      console.log(item);
      this.informanteDatos = { ...item };
      console.log(this.informanteDatos);
      this.open = true;
    },

    OpenAgregar() {
      this.informanteDatos = { ...this.datosInformantes };
      console.log(this.informanteDatos);
      this.open = true;
    },

    CerrarModal() {
      this.informanteDatos = { ...this.datosInformantes };
      this.open = false;
    },

    async Guardar() {
      if (this.informanteDatos.id == 0) {
        console.log(this.informanteDatos);

        let result = await informantesServices.addInformante(this.informanteDatos);

        if (result.data) {
          this.toast.success(result.data.message);
          this.open = false;
          await this.listaInformante();
          await this.listaInformanteV2(1);
        } else {
          this.toast.error(result.response.data.message)
          this.open = false;
          console.log(result);
        }
      } else {
        let result = await informantesServices.updateInformante(this.informanteDatos);

        if (result.data) {
          this.toast.success("Informante actualizado");
          this.open = false;
          await this.listaInformante();
          await this.listaInformanteV2(1);
        } else {
          this.toast.error(result.response.data.message)
          this.open = false;
          // console.log(result);
        }
      }
    },
    async masDatos() {
      this.page++;
      await this.listaInformanteV2();
    },

    async scrolling({ target }) {
      const { scrollingElement } = target;
      const gap = 10;
      if (scrollingElement.scrollTop + scrollingElement.clientHeight + gap >= scrollingElement.scrollHeight) {
        $('#btn-mas').click();
      }
    },
    async buscarResultados() {
      if(this.search.trim() !== '' && this.loading ==false){
        let payload = {
          buscar: this.search.trim(),
          page: 1,
          take: this.totalConsultas,
        };
        let result = await informantesServices.listaInformantesV2(payload);
        this.Informantes = result.data;
        this.loading = false;
        this.hasMoreItems = false;

      }else{
        this.hasMoreItems = true;
        await this.listaInformanteV2(1);
      }
    },

    async DeleteInformante() {
      let result = await informantesServices.deleteInformante(this.idEliminar);

      if (result.data.success) {
        this.toast.success("Informante eliminado");
        this.CerrarEliminar();
        await this.listaInformante();
        await this.listaInformanteV2(1);
      } else {
        console.log(result);
      }
    },

    async onSubmit() {
      let form = await this.$refs.refFormulario.validate();
      if (form.valid) {
        this.Guardar();
      }
    },
  },

  async created() {
    // await this.listaInformante();
    await this.listaInformanteV2();
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
    <p class="text-2xl mc-6"> <VIcon icon="tabler-user" color="primary"  class="me-3" size="30"/>Lista de Informantes</p>
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
          <VIcon class="tabler-plus" size="32"/>
        </VBtn>
      </VCol>
      <!-- <VRow> -->

        <!-- TARJETAS comienzo -->
        <!-- <VCol cols="12" md="3" v-for="informante in Informantes">
          <VCard>
            <VCardItem>
              <VRow class="pt-0 pb-2">
                <VCol md="2">
                  <VIcon icon="tabler-circle-letter-v" size="35" color="primary" class=""/>
                </VCol>
                <VCol md="10">
                  <div class="cente demo-space-x">
                    <VBtn title="Editar" size="25" color="success" @click="OpenEditar(informante)">
                      <VIcon
                        icon="tabler-edit" 
                        size="20"
                      />
                    </VBtn>
                    <VBtn title="Eliminar" size="25" color="error" @click="OpenEliminar(informante)">
                      <VIcon
                        icon="tabler-trash" 
                        size="20"
                      />
                    </VBtn>
                  </div>
                </VCol>
              </VRow>
              <hr/>
              <div >
                <VRow class="margin_top">
                  <VCol md="12">
                    <p><VIcon icon="tabler-user" class="me-5"/> <span>{{ informante.nombreCompleto }}</span></p>
                    <p><VIcon icon="tabler-phone-filled" class="me-5"/> <span>{{ informante.numeroTelefono }}</span></p>
                    <p><VIcon icon="tabler-category" class="me-5"/> <span>{{ informante.area }}</span></p>
                  </VCol>
                </VRow>
              </div>
            </VCardItem>
          </VCard>
        </VCol> -->
        <!-- TARJETAS fin -->

        <!-- TABLA comienzo -->
        <VCol cols="12" md="12">
                <VCard>
                    <VCardItem>
                        <VDataTable :headers="headers" :items="Informantes" :search="search">
                            <template #item.actions="{ item }">
                                <div class="d-flex gap-1">
                                    <VBtn title="Editar" size="25" color="success" @click="OpenEditar(item)">
                                        <VIcon icon="tabler-edit" size="20" />
                                    </VBtn>
                                    <VBtn class="separacion__boton-eliminar" title="Eliminar" size="25" color="error" @click="OpenEliminar(item.id)">
                                        <VIcon icon="tabler-trash" size="20" />
                                    </VBtn>
                                </div>
                            </template>
                        </VDataTable>
                    </VCardItem>
                </VCard>
            </VCol>

        <!-- TABLA fin -->

      <!-- </VRow> -->
      <!-- <VCol cols="12" md="12">
        <VCard>
          <VCardItem>
            <VDataTable :headers="headers" :items="Informantes" :search="search">
              <template #item.actions="{ item }">
                <div class="d-flex gap-1">
                  <IconBtn @click="OpenEditar(item)">
                    <VIcon icon="tabler-edit" />
                  </IconBtn>
                  <IconBtn @click="OpenEliminar(item)">
                    <VIcon icon="tabler-trash" />
                  </IconBtn>
                </div>
              </template>
            </VDataTable>
          </VCardItem>
        </VCard>
      </VCol> -->
    </VRow>
  </div>

  <VDialog v-model="open" max-width="500px">
    <VCard>
      <VCardTitle class="pa-6">
        <span class="headline">{{
          informanteDatos.id != 0 ? "Editar informante" : "Agregar informante"
        }}</span>
      </VCardTitle>
      <VCardText class="pt-0 pb-0">
        <VForm
          ref="refFormulario"
          @submit.prevent="
            () => {
              onSubmit();
            }
          "
        >
          <VRow>
            <VCol cols="12" md="12">
              <VTextField
                v-model="informanteDatos.nombreCompleto"
                label="Nombre completo"
                validate-on="input"
                :rules="[requiredValidator]"
              />
            </VCol>

            <VCol cols="12" md="12">
              <VTextField
                v-model="informanteDatos.numeroTelefono"
                label="Telefono"
                validate-on="input"
                :rules="[
                  requiredValidator,
                  lengthValidator(informanteDatos.numeroTelefono, 10),
                  integerValidator,
                ]"
              />
            </VCol>
           <VCol cols="12" md="12">
             <VTextField
              v-model="informanteDatos.area"
              label="Area"
              validate-on="input"
              :rules="[requiredValidator]"
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
      <VCardActions>
        <VSpacer />
      </VCardActions>
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

        <VBtn color="success" variant="elevated" @click="this.DeleteInformante()">
          Aceptar
        </VBtn>

        <VSpacer />
      </VCardActions>
    </VCard>
  </VDialog>
</template>
<style scoped>
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

.separacion__boton-eliminar {
  margin-left: 5px;
}
</style>