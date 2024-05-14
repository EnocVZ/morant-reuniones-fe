<script>
import { VDataTable } from "vuetify/labs/VDataTable";
import { useToast } from "vue-toastification";
import "vue-toastification/dist/index.css";
import tipoServices from "@/services/inbox/tipo-acontecimiento-services.js";

export default {
  name: "Tipos acontecimientos",
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
      totalConsultas : 0,
      headers: [
        {
          title: "",
          key: "blank",
        },
        {
          title: "Id",
          key: "id",
        },
        {
          title: "Emojis",
          key: "emojis",
        },
        {
          title: "Descripcion",
          key: "descripcion",
        },
        {
          title: "Acciones",
          key: "actions",
        },
      ],
      refFormulario: "",
      datosAcontecimiento: {
        id: 0,
        emojis: "",
        descripcion: "",
        color: "",
      },
      Editar: null,
      idEliminar: 0,
      acontecimientoDatos: {
        id: 0,
        emojis: "",
        descripcion: "",
        color: "",
      },
      Acontecimientos: [],
      open: false,
      modalEliminar: false,
      Colores: [
        { rgb: "0, 0, 0", color: "Negro" },
        { rgb: "255, 255, 255", color: "Blanco" },
        { rgb: "255, 0, 0", color: "Rojo" },
        { rgb: "0, 255, 0", color: "Verde" },
        { rgb: "0, 0, 255", color: "Azul" },
        { rgb: "255, 255, 0", color: "Amarillo" },
        { rgb: "255, 0, 255", color: "Magenta" },
        { rgb: "0, 255, 255", color: "Cian" },
        { rgb: "128, 0, 0", color: "Marrón" },
        { rgb: "128, 128, 0", color: "Ocre" },
        { rgb: "128, 128, 128", color: "Gris" },
        { rgb: "192, 192, 192", color: "Plata" },
        { rgb: "128, 0, 128", color: "Púrpura" },
        { rgb: "0, 128, 128", color: "Verde Azulado" },
        { rgb: "255, 165, 0", color: "Naranja" },
        { rgb: "255, 192, 203", color: "Rosa" },
        { rgb: "255, 228, 181", color: "Melocotón" },
        { rgb: "154, 205, 50", color: "Verde Lima" },
        { rgb: "0, 128, 0", color: "Verde Oscuro" },
        { rgb: "0, 100, 0", color: "Verde Bosque" },
        { rgb: "255, 20, 147", color: "Rosa Profundo" },
        { rgb: "255, 0, 255", color: "Magenta" },
        { rgb: "139, 0, 139", color: "Violeta" },
        { rgb: "128, 0, 0", color: "Rojo Oscuro" },
        { rgb: "255, 140, 0", color: "Naranja Rojizo" },
        { rgb: "255, 69, 0", color: "Rojo Naranja" },
        { rgb: "255, 218, 185", color: "Salmón" },
        { rgb: "255, 99, 71", color: "Tomate" },
        { rgb: "255, 127, 80", color: "Coral" },
        { rgb: "255, 160, 122", color: "Salmón Claro" },
        { rgb: "255, 69, 0", color: "Rojo Naranja" },
        { rgb: "218, 165, 32", color: "Oro" },
        { rgb: "255, 250, 205", color: "Blanco Humo" },
      ],
    };
  },

  methods: {
    async listaAcontecimientos() {
      let result = await tipoServices.listaTipoAcon().then((res) => {
        this.Acontecimientos = res.data;
      });
    },

    async listaAcontecimientosV2(page) {
      this.loading = true;

      if (this.hasMoreItems) {
        this.page = page ? page : this.page;

        let payload = {
          buscar: "",
          page: this.page,
          take: this.itemsPerPage,
        };
        let result = await tipoServices.listaTipoAconV2(payload)
          .then((res) => {
              this.Acontecimientos = this.page == 1 ? res.data : [...this.Acontecimientos, ...res.data];
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
      this.acontecimientoDatos = { ...item };
      this.open = true;
    },

    OpenAgregar() {
      this.acontecimientoDatos = { ...this.datosAcontecimiento };
      this.open = true;
    },

    CerrarModal() {
      this.acontecimientoDatos = { ...this.acontecimientoDatos };
      this.open = false;
    },

    async Guardar() {
      // console.log(this.acontecimientoDatos, "Prueba");
      if (this.acontecimientoDatos.id == 0) {
        let result = await tipoServices.addTipoAcon(this.acontecimientoDatos);

        if (result.data.success) {
          this.toast.success(result.data.message);
          this.open = false;
          await this.listaAcontecimientosV2(1);
        } else {
        }
      } else {
        let result = await tipoServices.updateTipoAcon(
          this.acontecimientoDatos
        );

        if (result.data.success) {
          this.toast.success(result.data.message);
          this.open = false;
          await this.listaAcontecimientosV2(1);
        } else {
        }
      }
    },
    async masDatos() {
      this.page++;
      await this.listaAcontecimientosV2();
    },

    async scrolling({ target }) {
      const { scrollingElement } = target;
      const gap = 10;
      if (scrollingElement.scrollTop + scrollingElement.clientHeight + gap >= scrollingElement.scrollHeight) {
          $('#btn-mas').click();
      }
    },
    async deleteEstados() {
      let result = await tipoServices.deleteTipoAcon(this.idEliminar);

      if (result.data.success) {
        this.toast.success(result.data.message);
        this.CerrarEliminar();
        await this.listaAcontecimientosV2(1);
      } else {
      }
    },
    async buscarResultados() {
      if(this.search.trim() !== '' && this.loading == false){
        let payload = {
          buscar: this.search.trim(),
          page: 1,
          take: this.totalConsultas,
        };
        let result = await tipoServices.listaTipoAconV2(payload);
        this.Acontecimientos = result.data;
        this.loading = false;
        this.hasMoreItems = false;

      }else{
        this.hasMoreItems = true;
        await this.listaAcontecimientosV2(1);
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
    // await this.listaAcontecimientos();
    await this.listaAcontecimientosV2();
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
      <VIcon
        icon="tabler-timeline-event-text"
        color="primary"
        class="me-3"
        size="30"
      />Lista de tipos acontecimientos
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
      <VCol cols="12" md="8">
        <VBtn color="cafe" @click="OpenAgregar" size="40" rounded="pill">
          <VIcon class="tabler-plus" size="32" />
        </VBtn>
      </VCol>
      <VCol cols="12" md="3" class="margin_top" v-for="acontecimiento in Acontecimientos" :key="acontecimiento.id">
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
                <div class="cente demo-space-x margen-botones">
                  <VBtn
                    title="Editar"
                    size="25"
                    color="success"
                    @click="OpenEditar(acontecimiento)"
                  >
                    <VIcon icon="tabler-edit" size="20" />
                  </VBtn>
                  <VBtn
                    title="Eliminar"
                    size="25"
                    color="error"
                    @click="OpenEliminar(acontecimiento)"
                  >
                    <VIcon icon="tabler-trash" size="20" />
                  </VBtn>
                </div>
              </VCol>
            </VRow>
            <hr />
          <div>
            <VRow class="margin_top">
              <VCol md="2">
                <VIcon color="primary" icon="tabler-alert-triangle" class="me-5" />
              </VCol>
              <VCol md="10">
                <p>{{ acontecimiento.emojis }}</p>
                <p>{{ acontecimiento.descripcion }}</p>
              </VCol>
            </VRow>
          </div>
          </VCardItem>
        </VCard>
      </VCol>
      <!-- <VCol cols="12" md="12">
        <VCard>
          <VCardItem>
            <VDataTable
              :headers="headers"
              :items="Acontecimientos"
              :search="search"
            >
              
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
          acontecimientoDatos.id != 0
            ? "Editar tipo acontecimiento"
            : "Agregar tipo acontecimiento"
        }}</span>
      </VCardTitle>
      <VCardText class="pt-0 pb-3">
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
                v-model="acontecimientoDatos.emojis"
                label="Emoji"
                validate-on="input"
                :rules="[
                  requiredValidator,
                  maxLengthValidator(acontecimientoDatos.emojis, 10),
                ]"
              />
            </VCol>

            <VCol cols="12" md="12">
              <VTextField
                v-model="acontecimientoDatos.descripcion"
                label="Descripcion"
                validate-on="input"
                :rules="[requiredValidator]"
              />
            </VCol>
            <VCol cols="12">
              <!-- <VSelect
                label="Tipos de colores de acontencimiento"
                placeholder="Color"
                :items="Colores"
                item-value="rgb"
                item-title="color"
                v-model="acontecimientoDatos.color"
                :rules="[requiredValidator]"
              /> -->
              <v-color-picker
                :rules="[requiredValidator]"
                v-model="acontecimientoDatos.color"
                hide-inputs
                show-swatches
              ></v-color-picker>
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

        <VBtn color="success" variant="elevated" @click="this.deleteEstados()">
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

.margen-botones button{
  margin: 16px 0 0 10px;
}
</style>

