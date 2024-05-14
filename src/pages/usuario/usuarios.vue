<script>
import usuarioService from "@/services/usuarios-service";
import { VDataTable } from "vuetify/labs/VDataTable";
import { useToast } from "vue-toastification";
import "vue-toastification/dist/index.css";

export default {
  name: "usuarios",

  components: {
    VDataTable,
  },

  data() {
    return {
      toast: useToast(),
      Usuarios: [],
      search: "",
      page: 1,
      itemsPerPage: 12,
      hasMoreItems: true,
      loading: false,
      totalConsultas: 0,
      headers: [
        {
          title: "Id",
          key: "id",
        },
        {
          title: "Nombre",
          key: "nombreCompleto",
        },
        {
          title: "Correo",
          key: "correo",
        },
        {
          title: "Tipo de usuario",
          key: "tipoUsuarioString",
        },
        {
          title: "Tipo de permiso",
          key: "tipoPermisoString",
        },
        {
          title: "Ultimo acceso",
          key: "ultimoAccesoString",
        },
      ],
      idUsuario: 0,
      modalEliminar: false,
    };
  },

  methods: {
    async _ObtenerUsuarios() {
      const result = await usuarioService.obtenerUsuarios();
      if (result != null) {
        this.Usuarios = result.data.data;
      }
    },
    async _ObtenerUsuariosV2(page) {
      this.loading = true;

      if (this.hasMoreItems) {
        this.page = page ? page : this.page;

        let payload = {
          buscar: "",
          page: this.page,
          take: this.itemsPerPage,
        };
        let result = await usuarioService
          .obtenerUsuariosV2(payload)
          .then((res) => {
            console.log(res.data);
            this.Usuarios =
              this.page == 1 ? res.data : [...this.Usuarios, ...res.data];
            this.totalConsultas = res.total;
            this.hasMoreItems = res.total > this.page * this.itemsPerPage;
            this.loading = false;
          })
          .catch((err) => {
            console.log(err);
            this.loading = false;
          });
      }
    },

    async masDatos() {
      this.page++;
      await this._ObtenerUsuariosV2();
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
    async buscarResultados() {
      if (this.search.trim() !== "" && this.loading == false) {
        let payload = {
          buscar: this.search.trim(),
          page: 1,
          take: this.totalConsultas,
        };
        let result = await usuarioService.obtenerUsuariosV2(payload);
        this.Usuarios = result.data;
        this.loading = false;
        this.hasMoreItems = false;
      } else {
        this.hasMoreItems = true;
        await this._ObtenerUsuariosV2(1);
      }
    },
    OpenEliminar(item) {
      this.idUsuario = item;
      this.modalEliminar = true;
    },
    OpenAgregar() {
      this.$router.push({ name: "usuario-alt-mod-usuario" });
    },
    Editar(id) {
      console.log(id);
      this.$router.push({
        name: "usuario-alt-mod-usuario/editar",
        params: {
          id: id,
        },
      });
    },
    async Eliminar() {
      let res = await usuarioService
        .eliminarUsuario(this.idUsuario)
        .then((data) => data);
      console.log(res);
      if (res?.data?.success) {
        this.toast.success(res?.data?.message);
        this.modalEliminar = false;
        this.hasMoreItems = true;
        await this._ObtenerUsuariosV2();
        this.hasMoreItems = false;
      }
    },
  },
  async created() {
    // await this._ObtenerUsuarios();
    await this._ObtenerUsuariosV2();
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
    <p class="text-2xl mb-6">
      <VIcon icon="tabler-users" color="primary" class="me-3" size="30" />
      Lista de usuarios
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
      <!-- <VCol cols="12" md="6">
                <VBtn color="#b48d57">
                    Agregar
                </VBtn>
            </VCol> -->

      <VCol cols="12" md="3" v-for="usuario in Usuarios">
        <VCard>
          <VCardItem>
            <VRow mb-5>
              <VCol md="12">
                <div class="cente d-flex justify-space-between mb-3">
                  <VIcon color="primary" class="tabler-user" />
                  <div class="cente demo-space-x margen-botones">
                    <VBtn title="Editar" size="25" color="success" @click="Editar(usuario.id)">
                      <VIcon icon="tabler-edit" size="20" />
                    </VBtn>
                    <VBtn v-if="usuario.tipoUsuario != 1" title="Eliminar" size="25" color="error"
                      @click="OpenEliminar(usuario.id)">
                      <VIcon icon="tabler-trash" size="20" />
                    </VBtn>
                  </div>
                </div>
              </VCol>
            </VRow>
            <hr />
            <div class="color_hr">
              <VRow class="margin_top" mb-2>
                <VCol md="2">
                  <VIcon color="primary" class="tabler-map-pin" />
                </VCol>
                <VCol md="10">
                  <p>{{ usuario.nombreCompleto }}</p>
                </VCol>
              </VRow>
              <hr />
              <VRow class="margin_top">
                <VCol md="2">
                  <VIcon color="primary" class="tabler-mail" />
                </VCol>
                <VCol md="10">
                  <p>{{ usuario.correo }}</p>
                </VCol>
              </VRow>
              <hr />
              <VRow class="margin_top">
                <VCol md="2">
                  <VIcon color="primary" class="tabler-user-star" />
                </VCol>
                <VCol md="10">
                  <p>{{ usuario.tipoUsuarioString }}</p>
                </VCol>
              </VRow>
              <hr />
              <VRow class="margin_top">
                <VCol md="12">
                  <p>Último acceso: {{ usuario.ultimoAccesoString }}</p>
                </VCol>
              </VRow>
            </div>
          </VCardItem>
        </VCard>
      </VCol>

      <!-- 
            <VCol cols="12" md="12">
                <VCard>
                    <VCardItem>
                        <VDataTable :headers="headers" :items="Usuarios" :search="search">
                            <template #item.actions="{ item }">
                                <div class="d-flex gap-1">
                                    <IconBtn>
                                        <VIcon icon="tabler-edit" />
                                    </IconBtn>
                                    <IconBtn>
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

  <VDialog v-model="modalEliminar" max-width="500px">
    <VCard>
      <VCardTitle class="d-flex justify-center mt-1 mb-1"> ¿Deseas eliminar el registro? </VCardTitle>

      <VCardActions>
        <VSpacer />

        <VBtn color="error" variant="outlined" @click="modalEliminar = false">
          Cancelar
        </VBtn>

        <VBtn color="success" variant="elevated" @click="Eliminar">
          Aceptar
        </VBtn>

        <VSpacer />
      </VCardActions>
    </VCard>
  </VDialog>
</template>

<style scoped>
.margin_top {
  margin-top: 5px;
}

hr {
  color: rgba(130, 129, 129, 0.292);
}

.margen-botones button{
  margin: 16px 0 0 10px;
}
</style>
