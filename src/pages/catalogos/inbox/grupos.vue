<script>
import grupoServices from "@/services/inbox/grupos-services";
import acontecimientosServices from "@/services/inbox/acontecimientos-services";
import { VDataTable } from "vuetify/labs/VDataTable";
import { useToast } from "vue-toastification";
import "vue-toastification/dist/index.css";
import { VCardActions } from "vuetify/lib/components/index.mjs";

export default {
  name: "Grupos",
  components: {
    VDataTable,
    VCardActions,
  },
  data() {
    return {
      toast: useToast(),
      search: "",
      page: 1,
      itemsPerPage: 9,
      hasMoreItems: true,
      loading: false,
      headers: [
        {
          title: "",
          key: "blank",
        },
        // {
        //   title: "Id",
        //   key: "id",
        // },
        {
          title: "IdUltramsg",
          key: "ultramsgID",
        },
        {
          title: "Nombre",
          key: "nombre",
        },
        {
          title: "Acciones",
          key: "actions",
        },
      ],
      refFormulario: "",
      datosGrupo: {
        id: 0,
        ultramsgID: "",
        nombre: "",
      },
      Editar: null,
      idEliminar: 0,
      grupoDatos: {
        id: 0,
        ultramsgID: "",
        nombre: "",
      },
      Grupos: [],
      open: false,
      modalEliminar: false,
      GruposARegistrar: [],
      idGrupoRegistrar: "",
      totalConsultas: 0,
      consultar: false,
    };
  },

  methods: {
    async listaGrupos() {
      this.GruposARegistrar = [];
      let result = await grupoServices.listaGrupos().then((res) => {
        // this.Grupos = res.data;

        return res.data;
      });

      var res = await acontecimientosServices
        .listaGrupos()
        .then((data) => data.grupos);

      res?.data.map(async (datos) => {
        if (datos.name != "") {
          this.GruposARegistrar.push({ id: datos.id, nombre: datos.name });
        }
      });

      result.map(async (data) => {
        let index = this.GruposARegistrar.findIndex(
          (d) => d.id === data.ultramsgID
        );

        if (index !== -1) {
          let datos = this.GruposARegistrar.find(
            (d) => d.id === data.ultramsgID
          );
          this.GruposARegistrar.splice(index, 1);

          if (data.nombre != datos.nombre) {
            let result = await grupoServices.updateGrupo({
              id: data.id,
              ultramsgID: data.ultramsgID,
              nombre: datos.nombre,
            });

            if (result.data) {
              await this.listaGrupos();
            }
          }
        }
      });
    },
    async listaGruposV2(page) {
      this.GruposARegistrar = [];

      this.loading = true;

      if (this.hasMoreItems || this.consultar) {
        this.page = page ? page : this.page;
        let payload = {
          buscar: "",
          page: this.page,
          take: this.itemsPerPage,
        };
        var result = await grupoServices
          .listaGruposV2(payload)
          .then((res) => {
            this.Grupos =
              this.page == 1 ? res.data : [...this.Grupos, ...res.data];
            this.totalConsultas = res.total;
            this.hasMoreItems = res.total > this.page * this.itemsPerPage;
            this.loading = false;

            return res.data;
          })
          .catch((err) => {
            console.log(err);
            this.loading = false;
          });
        this.consultar = false;
      }

      // var res = await acontecimientosServices
      //   .listaGrupos()
      //   .then((data) => data.grupos);

      // res.map(async (datos) => {
      //   this.GruposARegistrar.push({ id: datos.id, nombre: datos.name });
      // });

      // result.map(async (data) => {
      //   let index = this.GruposARegistrar.findIndex(
      //     (d) => d.id === data.ultramsgID
      //   );

      //   if (index !== -1) {
      //     let datos = this.GruposARegistrar.find(
      //       (d) => d.id === data.ultramsgID
      //     );
      //     this.GruposARegistrar.splice(index, 1);

      //     if (data.nombre != datos.nombre) {
      //       let result = await grupoServices.updateGrupo({
      //         id: data.id,
      //         ultramsgID: data.ultramsgID,
      //         nombre: datos.nombre,
      //       });

      //       if (result.data) {
      //         // await this.listaGrupos();
      //         await this.listaGruposV2(1);
      //       }
      //     }
      //   }
      // });
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
      // console.log(item);
      this.grupoDatos = { ...item };
      // console.log(this.grupoDatos);
      this.open = true;
    },

    OpenAgregar() {
      this.grupoDatos = { ...this.datosGrupo };
      // console.log(this.grupoDatos);
      this.open = true;
    },

    CerrarModal() {
      this.grupoDatos = { ...this.datosGrupo };
      this.open = false;
    },

    async Guardar() {
      if (this.grupoDatos.id == 0) {
        this.grupoDatos.nombre = this.GruposARegistrar.find(
          (data) => data.id == this.grupoDatos.ultramsgID
        ).nombre;
        // console.log(this.grupoDatos);

        let result = await grupoServices.addGrupo(this.grupoDatos);

        if (result.data) {
          this.consultar = true;
          this.toast.success(result.data.message);
          this.grupoDatos = { ...this.datosGrupo };
          this.open = false;
          // await this.listaGrupos();
          await this.listaGruposV2(1);
        } else {
          this.toast.error(result.response.data.message);
          this.open = false;
        }
      }
    },
    async masDatos() {
      if (!this.consultar) {
        this.page++;
      }
      await this.listaGruposV2();
    },
    async buscarResultados() {
      if (this.search.trim() !== "" && this.loading == false) {
        let payload = {
          buscar: this.search.trim(),
          page: 1,
          take: this.totalConsultas,
        };
        let result = await grupoServices.listaGruposV2(payload);
        this.Grupos = result.data;
        this.loading = false;
        this.hasMoreItems = false;
      } else {
        this.hasMoreItems = true;
        await this.listaGruposV2(1);
      }
    },

    async scrolling({ target }) {
      const { scrollingElement } = target;
      const gap = 10;
      if (
        scrollingElement.scrollTop + scrollingElement.clientHeight + gap >=
        scrollingElement.scrollHeight
      ) {
        $("#btn-mas").click();
      }
    },
    async DeleteGrupo() {
      let result = await grupoServices.deleteGrupo(this.idEliminar);

      if (result.data.success) {
        this.consultar = true;
        this.toast.success("Grupo eliminado");
        this.CerrarEliminar();
        // await this.listaGrupos();
        await this.listaGruposV2(1);
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

    // cumpleCriterioBusqueda(grupo) {
    //   if (!this.search) {
    //     return true;
    //   }
    //   const searchTerm = this.search.toLowerCase();
    //   const ultramsgID = grupo.ultramsgID.toLowerCase();
    //   return ultramsgID.includes(searchTerm);
    // },
  },

  async created() {
    await this.listaGrupos();
    await this.listaGruposV2();
  },
  mounted() {
    window.addEventListener("scroll", this.scrolling);
  },

  unmounted() {
    window.removeEventListener("scroll", this.scrolling);
  },

  beforeDestroy() {
    window.removeEventListener("scroll", this.scrolling);
  },
};
</script>

<template>
  <div>
    <a href="" id="btn-mas" style="display: none" @click.prevent="masDatos()"></a>
    <p class="text-2xl mc-6">
      <VIcon icon="tabler-users-group" color="primary" class="me-3" size="30" />Lista de Grupos
    </p>
    <VRow>
      <VCol cols="12" md="4">
        <AppTextField v-model="search" density="compact" placeholder="Buscar..." append-inner-icon="tabler-search"
          single-line hide-details dense outlined @input="buscarResultados" />
      </VCol>
      <!-- Boton amarillo agregar -->
      <VCol cols="12" md="8">
        <VBtn color="cafe" @click="OpenAgregar" :onclick="() => listaGrupos()" size="40" rounded="pill">
          <VIcon class="tabler-plus" size="32" />
        </VBtn>
      </VCol>

      <VRow class="scroll_Tarjetas">
        <VCol cols="12" md="4" v-for="grupo in Grupos">
          <!-- <VCard v-if="cumpleCriterioBusqueda(grupo)"> -->
          <VCard>
            <VCardItem>
              <VRow class="pt-0 pb-2">
                <VCol md="6"> IdUltramsg </VCol>
                <VCol md="6"> Nombre </VCol>
                <!-- <VCol md="6"> ACCIONES </VCol> -->
              </VRow>
              <hr />
              <VRow class="my-2">
                <VCol md="6">
                  {{ grupo.ultramsgID }}
                </VCol>

                <VCol md="6">
                  {{ grupo.nombre }}
                </VCol>
                <VCol md="12">
                  <div class="cente justify-end demo-space-x margen-botones">
                    <!-- <VBtn
                      title="Editar"
                      size="25"
                      color="success"
                      @click="OpenEditar(grupo)"
                    >
                      <VIcon icon="tabler-edit" size="20" />
                    </VBtn> -->
                    <VBtn title="Eliminar" size="25" color="error" @click="OpenEliminar(grupo)">
                      <VIcon icon="tabler-trash" size="20" />
                    </VBtn>
                  </div>
                </VCol>
              </VRow>
            </VCardItem>
          </VCard>
        </VCol>
      </VRow>

      <!-- <VCol cols="12" md="12">
        <VCard>
          <VCardItem>
            <VDataTable  :headers="headers" :items="Grupos" :search="search">
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
      <VCardTitle style="padding: 24px;">
        <span class="headline">{{
          grupoDatos.id != 0 ? "Editar grupo" : "Agregar grupo"
        }}</span>
      </VCardTitle>
      <VCardText class="pt-0 pb-0">
        <VForm ref="refFormulario" @submit.prevent="() => {
            onSubmit();
          }
          ">
          <VRow>
            <!-- <VCol cols="12" md="12">
              <VTextField
                v-model="grupoDatos.ultramsgID"
                label="IdUltramsg"
                validate-on="input"
                :rules="[requiredValidator]"
              />
            </VCol>

            <VCol cols="12" md="12">
              <VTextField
                v-model="grupoDatos.nombre"
                label="Nombre"
                validate-on="input"
                :rules="[requiredValidator]"
              />
            </VCol> -->

            <VCol cols="12" md="12">
              <VSelect label="Grupos" placeholder="Selecione un tipo" :items="GruposARegistrar" item-title="nombre"
                item-value="id" v-model="grupoDatos.ultramsgID" prepend-icon="tabler-alert-triangle"
                :rules="[requiredValidator]" />
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
      <VCardTitle class="text-center mt-1 mb-1">¿Deseas eliminar el registro? </VCardTitle>

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

  <VCard> </VCard>
</template>

<style scoped>
.cafe-btn {
  background-color: #b48d57;
  color: #fff;
}

.v-data-table th {
  background-color: #3498db;
  /* Cambia este color según tus preferencias */
  color: white;
  /* Cambia este color según tus preferencias */
}

/* .scroll_Tarjetas {
    height: 490px;
    max-height: 50%;
    width: 100%;
    overflow: auto;
    display: flex;
} */

.margen-botones button{
  margin: 16px 0 0 10px;
}
</style>
