<script>
import palabraServices from "@/services/inbox/palabras-vinculadas-services";
import { VDataTable } from "vuetify/labs/VDataTable";
import { useToast } from "vue-toastification";
import "vue-toastification/dist/index.css";
import { VCardActions } from "vuetify/lib/components/index.mjs";

export default {
  name: "Palabras vinculadas",
  components: {
    VDataTable,
    VCardActions,
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
        {
          title: "",
          key: "blank",
        },
        {
          title: "Id",
          key: "id",
        },
        {
          title: "Palabra",
          key: "palabra",
        },
        {
          title: "Acciones",
          key: "actions",
        },
      ],
      refFormulario: "",
      datosPalabra: {
        id: 0,
        palabra: "",
      },
      Editar: null,
      idEliminar: 0,
      palabraDatos: {
        id: 0,
        palabra: "",
      },
      Palabras: [],
      open: false,
      totalConsultas : 0,
      modalEliminar: false,
    };
  },

  methods: {
    async listaPalabras() {
      let result = await palabraServices.listaPalabras().then((res) => {
        this.Palabras = res.data;
      });
    },
    async listaPalabrasV2(page) {
      this.loading = true;

      if (this.hasMoreItems) {
        this.page = page ? page : this.page;

        let payload = {
          buscar: "",
          page: this.page,
          take: this.itemsPerPage,
        };
        let result = await  palabraServices.listaPalabrasV2(payload)
          .then((res) => {
            this.Palabras = this.page == 1 ? res.data : [...this.Palabras, ...res.data];
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
      await this.listaPalabrasV2();
    },

    async scrolling({ target }) {
      const { scrollingElement } = target;
      const gap = 10;
      if (scrollingElement.scrollTop + scrollingElement.clientHeight + gap >= scrollingElement.scrollHeight) {
        $('#btn-mas').click();
      }
    },
    async buscarResultados() {
      if(this.search.trim() !== '' && this.loading == false){
        let payload = {
          buscar: this.search.trim(),
          page: 1,
          take: this.totalConsultas,
        };
        let result = await palabraServices.listaPalabrasV2(payload);
        this.Palabras = result.data;
        this.loading = false;
        this.hasMoreItems = false;

      }else{
        this.hasMoreItems = true;
        await this.listaPalabrasV2(1);
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
      this.palabraDatos = { ...item };
      console.log(this.palabraDatos);
      this.open = true;
    },

    OpenAgregar() {
      this.palabraDatos = { ...this.datosPalabra };
      console.log(this.palabraDatos);
      this.open = true;
    },

    CerrarModal() {
      this.palabraDatos = { ...this.datosPalabra };
      this.open = false;
    },

    async Guardar() {
      if (this.palabraDatos.id == 0) {
        // console.log(this.palabraDatos);

        let result = await palabraServices.addPalabras(this.palabraDatos);

        if (result.data.success) {
          this.toast.success(result.data.message);
          this.open = false;
          // await this.listaPalabras();
          await this.listaPalabrasV2(1);
        } else {
          console.log(result);
        }
      } else {
        let result = await palabraServices.updatePalabras(this.palabraDatos);

        if (result.data.success) {
          this.toast.success("Palabra actualizado");
          this.open = false;
          // await this.listaPalabras();
          await this.listaPalabrasV2(1);
        } else {
          console.log(result);
        }
      }
    },

    async DeleteGrupo() {
      let result = await palabraServices.deletePalabras(this.idEliminar);

      if (result.data.success) {
        this.toast.success("Palabra eliminado");
        this.CerrarEliminar();
        // await this.listaPalabras();
        await this.listaPalabrasV2(1);
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
    // await this.listaPalabras();
    await this.listaPalabrasV2();
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
    <div class="mb-5">
      <a href="" id="btn-mas" style="display: none;" @click.prevent="masDatos()"></a>
      <p class="text-2xl"> <VIcon icon="tabler-list-search" color="primary"  class="me-3" size="30"/>Lista de Palabras vinculadas</p>
    </div>
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
        <VBtn color="cafe" size="40" rounded="pill" @click="OpenAgregar">
          <VIcon class="tabler-plus" size="32"/>
        </VBtn>
      </VCol>

      <VCol cols="12" md="4" v-for="palabra in Palabras" :search="search">
        <VCard>
          <VCardItem>
            <VRow class="pt-0 pb-2">
              <VCol md="2">
                <VIcon color="primary" icon="tabler-list-search" class=""/>
              </VCol>
              <VCol md="10">
                <div class="cente justify-end demo-space-x margen-botones">

                  <VBtn title="Editar" size="25" color="success" @click="OpenEditar(palabra)">
                    <VIcon
                      icon="tabler-edit"
                      size="20"
                    />
                  </VBtn>
                  <VBtn title="Eliminar" size="25" color="error" @click="OpenEliminar(palabra)">
                    <VIcon icon="tabler-trash" size="20"/>
                  </VBtn>
                </div>
              </VCol>
            </VRow>
            <hr>
            <div class="pt-5">
              <VIcon color="primary" icon="tabler-align-box-left-middle" class="me-5"/>
              <span>{{ palabra.palabra }}</span>
            </div>
          </VCardItem>
        </VCard>
      </VCol>


      <!-- <VCol cols="12" md="12">
        <VCard>
          <VCardItem>
            <VDataTable :headers="headers" :items="Palabras" :search="search">
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
          palabraDatos.id != 0 ? "Editar palabra" : "Agregar palabra"
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
                v-model="palabraDatos.palabra"
                label="Palabra"
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
      <VCardTitle class="d-flex justify-center mt-1 mb-1"> ¿Deseas eliminar el registro? </VCardTitle>

      <VCardActions>
        <VSpacer />

        <VBtn color="error" variant="outlined" @click="CerrarEliminar">
          Cancelar
        </VBtn>

        <VBtn color="success" variant="elevated" @click="DeleteGrupo">
          Aceptar
        </VBtn>

        <VSpacer />
      </VCardActions>
    </VCard>
  </VDialog>
</template>

<style scoped>

.cente{
  display: flex;
  justify-content: end;
}

.margen-botones button{
  margin: 16px 0 0 10px;
}
</style>
